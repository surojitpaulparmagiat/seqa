const { Model, DataTypes } = require("sequelize");
const sequelize = require("../dbConfig/dbConnection");
const { UserDetailsModel } = require("./UserDetails.model");

class UserCredentialModel extends Model {}

UserCredentialModel.init(
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
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
  },
  {
    sequelize,
    tableName: "user_credentials",
  },
);

module.exports = {
  UserCredentialModel,
};
