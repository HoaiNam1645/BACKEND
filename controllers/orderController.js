const orderService = require("../services/orderService");

const getAllOrders = async (req, res) => {
  const result = await orderService.getAllOrders();
  return res.status(result.code).json(result);
};

const getAllOrdersByUser = async (req, res) => {
  const result = await orderService.getAllOrdersByUser(req.params.id);
  return res.status(result.code).json(result);
};

const getOrderById = async (req, res) => {
  const result = await orderService.getOrderById(req);
  return res.status(result.code).json(result);
};

const createOrder = async (req, res) => {
  const result = await orderService.createOrder(req);
  return res.status(result.code).json(result);
};

const updateOrder = async (req, res) => {
  const result = await orderService.updateOrder(req.params.id, req.body);
  return res.status(result.code).json(result);
};

const deleteOrder = async (req, res) => {
  const result = await orderService.deleteOrder(req.params.id);
  return res.status(result.code).json(result);
};

const searchOrder = async (req, res) => {
  const result = await orderService.searchOrder(req.body);
  return res.status(result.code).json(result);
};

const updateStatusOrder = async (req, res) => {
  const result = await orderService.updateStatusOrder(
    req.body.orderId,
    req.body.status
  );
  return res.status(result.code).json(result);
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  searchOrder,
  getAllOrdersByUser,
  updateStatusOrder,
};
