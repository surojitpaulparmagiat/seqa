const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("sqdb", "root", "arijit", {
  host: "localhost",
  dialect: "mysql",
  logging: console.log,
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.log("Unable to connect to the database:", error);
  }
})();
module.exports = sequelize;
