const { Model, DataTypes } = require("sequelize");
const sequelize = require("../dbConfig/dbConnection");

class FirmModel extends Model {}

FirmModel.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firm_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},{
    tableName: "firms",
    sequelize
});

module.exports = {
    FirmModel,
}