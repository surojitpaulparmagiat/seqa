const { Model, DataTypes } = require("sequelize");
const sequelize = require("../dbConfig/dbConnection");
const { UserModel } = require("./User.model");

class FirmModel extends Model {}

FirmModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firm_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_by_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserModel,
        key: "id",
      },
    },
    admin_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserModel,
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("active", "inactive", "deleted"),
      defaultValue: "active",
    },
  },
  {
    tableName: "firms",
    sequelize,
  },
);

// each firm is created by some user and each firm has an admin user
FirmModel.hasOne(UserModel, {
  foreignKey: "id",
  sourceKey: "created_by_user_id",
  as: "created_by_user",
});
FirmModel.hasOne(UserModel, {
  foreignKey: "id",
  sourceKey: "admin_user_id",
  as: "admin_user",
});

module.exports = {
  FirmModel,
};
