const { Model, DataTypes } = require("sequelize");
const sequelize = require("../dbConfig/dbConnection");
const { UserDetailsModel } = require("./UserDetails.model");
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
        model: UserDetailsModel,
        key: "id",
        cascade: true,
      },
    },
    firm_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: FirmModel,
        key: "id",
        cascade: true,
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


UserFirmModel.belongsTo(UserDetailsModel, { foreignKey: "user_id", as: "user" });
UserDetailsModel.belongsToMany(FirmModel, { through: UserFirmModel, foreignKey: "user_id", otherKey: "firm_id", as: "firms" });


module.exports = {
  UserFirmModel,
};
