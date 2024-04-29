const sequelize = require("../dbConfig/dbConnection");
const { UserCredentialModel, UserDetailsModel } = require("../models");
const { UserFirmModel } = require("../models/UserFirm.model");

class UserService {
  // create a new user
  async create(user) {
    const password = user.password;
    const email = user.email;

    const first_name = user.first_name;
    const last_name = user.last_name;
    const middle_name = user.middle_name;

    await sequelize.transaction(async (t) => {
      // create a new user
      const created_user = await UserDetailsModel.create(
        {
          first_name: first_name,
          last_name: last_name,
          middle_name: middle_name,
        },
        { transaction: t },
      );
      const created_user_id = created_user.id;

      // save the credentials
      await UserCredentialModel.create(
        {
          user_id: created_user_id,
          email: email,
          password: password,
        },
        {
          transaction: t,
        },
      );
    });
    return this.getByEmail(email);
  }

  async getByEmail(email) {
    const user = await UserCredentialModel.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async getById(id) {
    const user = await UserDetailsModel.findByPk(id, {
      // include: [
      //   {
      //     model: UserFirmModel,
      //     as: "firms",
      //   },
      // ],
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
