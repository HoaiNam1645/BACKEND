const userService = require("../services/userService");

const getAllUsers = async (req, res) => {
  const result = await userService.getAllUsers();
  return res.status(result.code).json(result);
};

const getUserById = async (req, res) => {
  const result = await userService.getUserById(req.params.id);
  return res.status(result.code).json(result);
};

const createUser = async (req, res) => {
  const result = await userService.createUser(req.body);
  return res.status(result.code).json(result);
};

const updateUser = async (req, res) => {
  const result = await userService.updateUser(req.params.id, req.body);
  return res.status(result.code).json(result);
};

const deleteUser = async (req, res) => {
  const result = await userService.deleteUser(req.params.id);
  return res.status(result.code).json(result);
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
