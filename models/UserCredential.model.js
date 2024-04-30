const { Model, DataTypes } = require("sequelize");
const sequelize = require("../dbConfig/dbConnection");
const { UserModel } = require("./User.model");
const bcrypt = require("bcrypt");

class UserCredentialModel extends Model {
  async hashPasswordAndSave(
    { user_id, email, plain_password },
    { transaction },
  ) {
    const hashedPassword = await bcrypt.hash(plain_password, 10);
    return UserCredentialModel.create(
      {
        user_id: user_id,
        email,
        password: hashedPassword,
      },
      { transaction },
    );
  }
}

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
        model: UserModel,
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "user_credentials",
  },
);

// note: adding both of this bi-directional association is very important
//  so we can use them in our queries (in includes)
UserCredentialModel.belongsTo(UserModel, {
  foreignKey: "user_id",
  // note: very important to add this to cascade delete
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
UserModel.hasOne(UserCredentialModel, {
  as: "credentials",
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = {
  UserCredentialModel,
};
