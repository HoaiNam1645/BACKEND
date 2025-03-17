const cartService = require("../services/cartService");

const getAllCarts = async (req, res) => {
  const result = await cartService.getAllCarts();
  return res.status(result.code).json(result);
};

const getCartById = async (req, res) => {
  const result = await cartService.getCartById(req.params.id);
  return res.status(result.code).json(result);
};

const createCart = async (req, res) => {
  const result = await cartService.createCart(req.body);
  return res.status(result.code).json(result);
};

const updateCart = async (req, res) => {
  const result = await cartService.updateCart(req.params.id, req.body);
  return res.status(result.code).json(result);
};

const deleteCart = async (req, res) => {
  const result = await cartService.deleteCart(req.params.id);
  return res.status(result.code).json(result);
};

module.exports = {
  getAllCarts,
  getCartById,
  createCart,
  updateCart,
  deleteCart,
};
