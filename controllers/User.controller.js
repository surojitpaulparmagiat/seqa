const { UserService } = require("../services");

const createUserController = async (req, res) => {
  const user_payload = req.body;
  try {
    const user_service = new UserService();
    const created_user = await user_service.create(user_payload);
    res.status(201).json(created_user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getUserByIdController = async (req, res) => {
  const { user_id } = req.params;
  try {
    const user_service = new UserService();
    const user = await user_service.getById(user_id);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


const getUserByEmailController = async (req, res) => {
  const { email } = req.params;
  try {
    const user_service = new UserService();
    const user = await user_service.getByEmail(email);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createUserController,
  getUserByIdController,
  getUserByEmailController
};
