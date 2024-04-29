const { Model, DataTypes } = require("sequelize");
const sequelize = require("../dbConfig/dbConnection");

class UserDetailsModel extends Model {}

UserDetailsModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    middle_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "user_details",
  },
);


module.exports = {
  UserDetailsModel,
};
