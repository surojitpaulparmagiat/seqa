const { Router } = require("express")
const { userController } =  require("../controllers");

const user_router = Router();

user_router.post("/", userController.createUserController);
user_router.get("/:user_id", userController.getUserByIdController);

module.exports = user_router;