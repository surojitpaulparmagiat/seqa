const { Sequelize } = require("sequelize");
const { createReadStream } = require("node:fs");
const path = require("node:path");

const host = process.env.MYSQL_HOST;
const user = process.env.MYSQL_USER;
const password = process.env.MYSQL_PASSWORD;
const database = process.env.MYSQL_DATABASE;

const sequelize = new Sequelize(database, user, password, {
  host: host,
  dialect: "mysql",
  logging: console.log,
  benchmark: true,
  dialectOptions: {
    infileStreamFactory: (file_name) => {
      const path_name = path.join(process.cwd(), "tmp", file_name);
      console.log("path_name", path_name)
      return createReadStream(path_name);
    },
    multipleStatements: true

  },
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
