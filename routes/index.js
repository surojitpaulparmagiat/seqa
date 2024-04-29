const { Router } = require("express");
const api_router = Router();

api_router.use("/users", require("./user.route"));

module.exports = api_router;
