const orderItemService = require("../services/orderItemService");

const getAllOrderItems = async (req, res) => {
  const result = await orderItemService.getAllOrderItems(req);
  return res.status(result.code).json(result);
};

const getOrderItemById = async (req, res) => {
  const result = await orderItemService.getOrderItemById(req.params.id);
  return res.status(result.code).json(result);
};

const createOrderItem = async (req, res) => {
  const result = await orderItemService.createOrderItem(req);
  return res.status(result.code).json(result);
};

const updateOrderItem = async (req, res) => {
  const result = await orderItemService.updateOrderItem(
    req.params.id,
    req.body
  );
  return res.status(result.code).json(result);
};

const deleteOrderItem = async (req, res) => {
  const result = await orderItemService.deleteOrderItem(req.params.id);
  return res.status(result.code).json(result);
};

module.exports = {
  getAllOrderItems,
  getOrderItemById,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem,
};
