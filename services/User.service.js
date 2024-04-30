//@ts-check
"use strict";
const sequelize = require("../dbConfig/dbConnection");
const { UserCredentialModel, UserModel, UserFirmModel } = require("../models");

class UserService {
  async create(user_creation_payload) {
    const password = user_creation_payload.password;
    const email = user_creation_payload.email;

    const first_name = user_creation_payload.first_name;
    const last_name = user_creation_payload.last_name;
    const middle_name = user_creation_payload.middle_name;

    await sequelize.transaction(async (t) => {
      // create a new user_creation_payload
      const created_user = await UserModel.create(
        {
          first_name: first_name,
          last_name: last_name,
          middle_name: middle_name,
        },
        { transaction: t },
      );
      const created_user_id = created_user.id;

      // save the credentials
      const user_credentials_mode = new UserCredentialModel();
      await user_credentials_mode.hashPasswordAndSave(
        {
          user_id: created_user_id,
          email: email,
          plain_password: password,
        },
        {
          transaction: t,
        },
      );
    });
    return this.getByEmail(email);
  }

  async getByEmail(email) {
    const user = await UserModel.findOne({
      include: [
        {
          required: false, // cause a left join
          model: UserCredentialModel,
          as: "credentials",
          where: {
            email: email,
          },
          // don't need to select any fields from credential table.
          // we just need to include for the where clause
          attributes: [],
        },
      ],
    });

    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async getById(id) {
    const user = await UserModel.findByPk(id, {
      include: [
        {
          model: UserFirmModel,
          as: "associated_firms",
        },
      ],
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}

module.exports = {
  UserService,
};
