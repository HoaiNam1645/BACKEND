const userService = require("../services/userService");

const getAllUsers = async (req, res) => {
  const result = await userService.getAllUsers(req);
  return res.status(result.code).json(result);
};

const getUserById = async (req, res) => {
  const result = await userService.getUserById(req, req.params.id);
  return res.status(result.code).json(result);
};

const createUser = async (req, res) => {
  const result = await userService.createUser(req.body);
  return res.status(result.code).json(result);
};

const updateUser = async (req, res) => {
  const result = await userService.updateUser(req, req.params.id, req.body);
  return res.status(result.code).json(result);
};

const deleteUser = async (req, res) => {
  const result = await userService.deleteUser(req.params.id);
  return res.status(result.code).json(result);
};

const searchUser = async (req, res) => {
  const result = await userService.searchUser(req, req.body);
  return res.status(result.code).json(result);
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  searchUser,
};
