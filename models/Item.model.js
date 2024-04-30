const { Model, DataTypes } = require("sequelize");
const sequelize = require("../dbConfig/dbConnection");
const { UserModel } = require("./User.model");
const { FirmModel } = require("./Firm.model");
const { ItemUnitModel } = require("./ItemUnit.model");

class ItemModel extends Model {}

ItemModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firm_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: FirmModel,
        key: "id",
      },
    },

    item_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    item_name_sec_lang: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sales_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    sales_description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    purchase_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },

    base_unit_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: ItemUnitModel,
        key: "id",
      },
    },
    sales_unit_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: ItemUnitModel,
        key: "id",
      },
    },
    purchase_unit_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: ItemUnitModel,
        key: "id",
      },
    },

    // extra fields
    created_by_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserModel,
        key: "id",
      },
    },
    updated_by_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: UserModel,
        key: "id",
      },
    },
    deleted_by_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: UserModel,
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("active", "deleted", "inactive"),
      allowNull: false,
      defaultValue: "active",
    },
  },
  {
    sequelize,
    tableName: "items",
  },
);

// note: this add a "base_unit_id" field to the ItemModel
ItemModel.belongsTo(ItemUnitModel, {
  foreignKey: "base_unit_id",
  as: "base_unit",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = {
  ItemModel,
};
