const { Router } = require("express")
const { itemController } =  require("../controllers");

const item_router = Router();


item_router.post("/", itemController.createItemController);
item_router.get("/", itemController.getAllItemsController);

module.exports = item_router;