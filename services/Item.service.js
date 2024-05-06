const { ItemUnitService } = require("./ItemUnit.service");
const sequelize = require("../dbConfig/dbConnection");
const { ItemModel, ItemUnitModel } = require("../models");
const xlsx = require("xlsx");
const { sql } = require("sequelize");
const path = require("node:path");
class ItemService {
  constructor({ firm_id, user_id }) {
    this.firm_id = firm_id;
    this.user_id = user_id;
  }

  async createItem({ item_create_payload }) {
    const item_payload = {
      item_name: item_create_payload.item_name,
      item_name_sec_lang: item_create_payload.item_name_sec_lang ?? null,
      sales_price: item_create_payload.sales_price ?? null,
      purchase_price: item_create_payload.purchase_price ?? null,
      created_by_id: this.user_id,
      updated_by_id: this.user_id,
      base_unit_id: null,
      sales_unit_id: null,
      purchase_unit_id: null,
      firm_id: this.firm_id,
    };

    const created_item = await sequelize.transaction(async (t) => {
      const item_unit_service = new ItemUnitService({ firm_id: this.firm_id });
      const base_unit_symbol = item_create_payload.base_unit;
      const base_unit = await item_unit_service.getOrCreate(base_unit_symbol, {
        transaction: t,
      });
      item_payload.base_unit_id = base_unit.id;

      return await ItemModel.create(item_payload, { transaction: t });
    });
    return this.getById(created_item.id);
  }

  async getById(item_id) {
    const item = await ItemModel.findOne({
      where: {
        id: item_id,
        firm_id: this.firm_id,
        status: "active",
      },
      include: [
        {
          model: ItemUnitModel,
          as: "base_unit",
          required: false,
        },
      ],
    });
    if (!item) {
      throw new Error("Item not found");
    }
    return item;
  }

  async getAllItems({ limit, page }) {
    return await ItemModel.findAll({
      where: {
        firm_id: this.firm_id,
        status: "active",
      },
      include: [
        {
          model: ItemUnitModel,
          as: "base_unit",
          required: false,
          attributes: ["unit_symbol", "unit_name"],
        },
      ],
      limit: Number(limit),
      offset: Number((page - 1) * limit),
    });
  }

  async createAllItemsFromFile({ file_location_on_disk, res }) {
    const unit_service = new ItemUnitService({ firm_id: this.firm_id });

    const workbook = xlsx.readFile(file_location_on_disk, {
      type: "file",
    });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = xlsx.utils.sheet_to_json(worksheet);

    const existed_units = {};

    const chunk_size = 1000;
    const no_of_chunks = Math.ceil(json.length / chunk_size);
    const items_mapped_chucked = Array(no_of_chunks).fill([]);

    await sequelize.transaction(async (t) => {
      for await (const [inx, item] of json.entries()) {
        const mapped_item = {
          firm_id: this.firm_id,
          item_name: item.item_name,
          item_name_sec_lang: item.item_name_sec_lang ?? null,
          sales_price: item.sales_price ?? null,
          purchase_price: item.purchase_price ?? null,
          created_by_id: this.user_id,
          updated_by_id: this.user_id,
          base_unit_id: null,
          sales_unit_id: null,
          purchase_unit_id: null,
        };

        const base_unit_symbol = item.base_unit;
        // fetch the base unit from db if not exists in the existed_units object
        // then calling getOrCreate method of ItemUnitService
        if (base_unit_symbol) {
          const from_existed_units = existed_units[base_unit_symbol];
          if (from_existed_units) {
            mapped_item.base_unit_id = from_existed_units.id;
          } else {
            const base_unit = await unit_service.getOrCreate(base_unit_symbol, {
              transaction: t,
            });
            mapped_item.base_unit_id = base_unit.id;
            existed_units[base_unit_symbol] = base_unit;
          }
        }

        // push this item to a specific chunk
        const push_at_chunk = Math.floor(inx / chunk_size);
        if (!items_mapped_chucked[push_at_chunk]) {
          items_mapped_chucked[push_at_chunk] = [];
        }
        items_mapped_chucked[push_at_chunk].push(mapped_item);
      }

      let c = 1;
      // create items in chunks
      console.time("bulk create items");
      for await (const chunk of items_mapped_chucked) {
        res.write(` Creating chunk ${c++} of ${no_of_chunks}\n`);
        await ItemModel.bulkCreate(chunk, { transaction: t });
      }
      console.timeEnd("bulk create items");
    });

    return items_mapped_chucked;
  }

  async dataFromInFile({ file_location_on_disk }) {
    const unit_service = new ItemUnitService({ firm_id: this.firm_id });

    // read from the Excel file
    const workbook = xlsx.readFile(file_location_on_disk, {
      type: "file",
    });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = xlsx.utils.sheet_to_json(worksheet);
    const existed_units = {};
    // first header
    const item_mapped = [
      {
        firm_id: "firm_id",
        item_name: "item_name",
        item_name_sec_lang: "item_name_sec_lang",
        sales_price: "sales_price",
        purchase_price: "purchase_price",
        created_by_id: "created_by_id",
        updated_by_id: "updated_by_id",
        base_unit_id: "base_unit_id",
        sales_unit_id: "sales_unit_id",
        purchase_unit_id: "purchase_unit_id",
      },
    ];
    await sequelize.transaction(async (t) => {
      for await (const [inx, item] of json.entries()) {
        if (inx === 0) continue;
        const mapped_item = {
          firm_id: this.firm_id,
          item_name: item.item_name,
          item_name_sec_lang: item.item_name_sec_lang ?? null,
          sales_price: item.sales_price ?? null,
          purchase_price: item.purchase_price ?? null,
          created_by_id: this.user_id,
          updated_by_id: this.user_id,
          base_unit_id: null,
          sales_unit_id: null,
          purchase_unit_id: null,
        };

        const base_unit_symbol = item.base_unit;
        // fetch the base unit from db if not exists in the existed_units object
        // then calling getOrCreate method of ItemUnitService
        if (base_unit_symbol) {
          const from_existed_units = existed_units[base_unit_symbol];
          if (from_existed_units) {
            mapped_item.base_unit_id = from_existed_units.id;
          } else {
            const base_unit = await unit_service.getOrCreate(base_unit_symbol, {
              transaction: t,
            });
            mapped_item.base_unit_id = base_unit.id;
            existed_units[base_unit_symbol] = base_unit;
          }
        }
        item_mapped.push(mapped_item);
      }
    });

    // create a csv file from the data in \tmp folder
    const csv_file_name = "Book1.csv";
    const csv_file_location = path.join(__dirname, "..", "tmp", csv_file_name);
    const ws = xlsx.utils.json_to_sheet(item_mapped, {
      skipHeader: true,
    });
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "items");
    xlsx.writeFile(wb, csv_file_location, {
      bookType: "csv",
    });

    // pass the csv file to the mysql
    // handle possible null values in the csv file
    // https://stackoverflow.com/questions/2675323/mysql-load-null-values-from-csv-data
    const q = `load data local infile '${csv_file_name}' into table items 
    fields terminated by ',' 
    lines terminated by '\n' 
    ignore 1 rows
    (firm_id, item_name, item_name_sec_lang, sales_price, purchase_price, created_by_id, updated_by_id, base_unit_id, @sales_unit_id, @purchase_unit_id)
    
    set  
    sales_unit_id = NULLIF(@sales_unit_id, ''),
    purchase_unit_id = NULLIF(@purchase_unit_id, '');
    `;
    console.time("load data in file");
    const res = await sequelize.query(q);
    console.timeEnd("load data in file");
    return res;
  }
}

module.exports = {
  ItemService,
};
