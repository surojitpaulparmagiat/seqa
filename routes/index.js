const { Router } = require("express");
const api_router = Router();

api_router.use("/users", require("./user.route"));
api_router.use("/items", require("./item.route"));

module.exports = api_router;
