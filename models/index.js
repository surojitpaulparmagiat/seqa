const { UserDetailsModel } = require("./UserDetails.model");
const { UserCredentialModel } = require("./UserCredential.model");
const { FirmModel } = require("./Firm.model");
const { UserFirmModel } = require("./UserFirm.model");

async function syncTable() {
  await FirmModel.sync({ alter: true });
  await UserDetailsModel.sync({ alter: true });
  await UserCredentialModel.sync({ alter: true });
    await UserFirmModel.sync({ alter: true });
}

syncTable().catch(console.error);
module.exports = {
  UserCredentialModel,
  UserDetailsModel,
  FirmModel,
  UserFirmModel
};
