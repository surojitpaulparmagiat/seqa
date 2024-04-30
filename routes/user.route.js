const { Router } = require("express")
const { userController } =  require("../controllers");

const user_router = Router();

user_router.get("/email/:email", userController.getUserByEmailController);
user_router.get("/:user_id", userController.getUserByIdController);
user_router.post("/", userController.createUserController);

module.exports = user_router;