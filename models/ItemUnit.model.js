const { Model, DataTypes } = require("sequelize");
const sequelize = require("../dbConfig/dbConnection");
const { FirmModel } = require("./Firm.model");

class ItemUnitModel extends Model {}

ItemUnitModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    unit_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unit_name_sec_lang: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    unit_symbol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firm_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: FirmModel,
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("active", "inactive", "deleted"),
      allowNull: false,
      defaultValue: "active",
    },
  },
  {
    sequelize,
    tableName: "item_units",
    indexes: [
      {
        unique: true,
        fields: ["unit_symbol", "firm_id", "status"],
      },
    ],
  },
);

module.exports = {
  ItemUnitModel,
};
