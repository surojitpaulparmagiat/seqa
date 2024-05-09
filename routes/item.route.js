const { Router } = require("express")
const { itemController } =  require("../controllers");

const item_router = Router();


item_router.post("/", itemController.createItemController);
item_router.get("/", itemController.getAllItemsController);
item_router.post("/bulk", itemController.bulkImportItemsController);
item_router.post("/bulk_in_file", itemController.bulkImportInFile);
item_router.get("/avg", itemController.getSalesItemsAverageController);

module.exports = item_router;