const { ItemUnitModel } = require("../models");

class ItemUnitService {
  constructor({ firm_id }) {
    this.firm_id = firm_id;
  }

  async getOrCreate(unit_symbol, options) {
    const item_unit = await this.getBySymbol(unit_symbol);

    if (item_unit) {
      return item_unit;
    } else {
      const created_item_unit = await this.create(
        {
          unit_name: unit_symbol,
          unit_symbol,
        },
        options,
      );
      return this.getUnitById(created_item_unit.id);
    }
  }

  async create(unit_create_payload, options) {
    const unit_name = unit_create_payload.unit_name;
    const unit_name_sec_lang = unit_create_payload.unit_name_sec_lang ?? null;
    const unit_symbol = unit_create_payload.unit_symbol;

    return this.withSession(options.transaction, async (transaction) => {
      return await ItemUnitModel.create({
        unit_name,
        unit_name_sec_lang,
        unit_symbol,
        firm_id: this.firm_id,
      });
    });
  }

  async getUnitById(unit_id) {
    const item_unit = await ItemUnitModel.findOne({
      where: {
        id: unit_id,
        firm_id: this.firm_id,
        status: "active",
      },
    });

    if (item_unit) {
      return item_unit;
    } else {
      // throw error
    }
  }

  async getBySymbol(unit_symbol) {
    return await ItemUnitModel.findOne({
      where: {
        unit_symbol: unit_symbol,
        firm_id: this.firm_id,
        status: "active",
      },
    });
  }

  async withSession(transaction_option, callback) {
    let transaction;
    if (transaction_option) {
      transaction = transaction_option;
    } else {
      transaction = await transaction();
    }
    return callback(transaction);
  }
}

module.exports = {
  ItemUnitService,
};
