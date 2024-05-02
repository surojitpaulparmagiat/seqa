const { ItemService } = require("../services");
const path = require("node:path");

const createItemController = async (req, res) => {
  try {
    const firm_id = req.body.firm_id;
    const user_id = req.body.user_id;
    const body = req.body;

    const item_service = new ItemService({ firm_id, user_id });
    const item = await item_service.createItem({ item_create_payload: body });
    return res.status(201).json({ item });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getAllItemsController = async (req, res) => {
  try {
    const firm_id = req.body.firm_id;
    const user_id = req.body.user_id;
    const { limit, page } = req.query;

    const item_service = new ItemService({ firm_id, user_id });
    const item = await item_service.getAllItems({ limit, page });
    return res.status(200).json({ item });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }y
};

const bulkImportItemsController = async (req, res) => {
  try {
    const firm_id = req.body.firm_id;
    const user_id = req.body.user_id;
    const file_name = path.join(__dirname, "..", "tmp", "Book1.xlsx");
    const item_service = new ItemService({ firm_id, user_id });
    const items = await item_service.createAllItemsFromFile({
      file_location_on_disk: file_name,
      res,
    });

    return res.end();
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createItemController,
  getAllItemsController,
  bulkImportItemsController,
};
