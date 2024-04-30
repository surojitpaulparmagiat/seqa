const { UserModel } = require("./User.model");
const { UserCredentialModel } = require("./UserCredential.model");
const { FirmModel } = require("./Firm.model");
const { UserFirmModel } = require("./UserFirm.model");

async function syncTable() {

  const force =false;
  await UserModel.sync({force, alter: true });
  await FirmModel.sync({force, alter: true });
  await UserModel.sync({force, alter: true });
  await UserCredentialModel.sync({force, alter: true });
}

// syncTable().catch(console.error);
module.exports = {
  UserCredentialModel,
  UserFirmModel,
  FirmModel,
  UserModel,
};
