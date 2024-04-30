const { ItemUnitService } = require("./ItemUnit.service");
const sequelize = require("../dbConfig/dbConnection");
const { ItemModel, ItemUnitModel } = require("../models");

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
          attributes: ["unit_symbol","unit_name"],
        },
      ],
      limit: Number(limit),
      offset: Number((page - 1) * limit),
    });
  }
}

module.exports = {
  ItemService,
};
