const { Model, DataTypes } = require("sequelize");
const sequelize = require("../dbConfig/dbConnection");
const { UserModel } = require("./User.model");
const { FirmModel } = require("./Firm.model");

class UserFirmModel extends Model {}

UserFirmModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserModel,
        key: "id",
      },
    },
    firm_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: FirmModel,
        key: "id",
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "user_firms",
  },
);

UserModel.hasMany(UserFirmModel, {
  as: "associated_firms",
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
FirmModel.hasMany(UserFirmModel, {
  as: "associated_users",
  foreignKey: "firm_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = {
  UserFirmModel,
};
