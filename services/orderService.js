const Order = require("../models/Order");
const { STATUS_CODE } = require("../Helper/enums");

const getAllOrders = async () => {
  try {
    const orders = await Order.find();
    return { code: STATUS_CODE.SUCCESS, success: true, data: orders };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const getOrderById = async (id) => {
  try {
    const order = await Order.findById(id);
    if (!order) {
      return {
        code: STATUS_CODE.BAD_REQUEST,
        success: false,
        message: "Order not found",
      };
    }
    return { code: STATUS_CODE.SUCCESS, success: true, data: order };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const createOrder = async (orderData) => {
  try {
    const order = await Order.create(orderData);
    return { code: STATUS_CODE.SUCCESS, success: true, data: order };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const updateOrder = async (id, orderData) => {
  try {
    const order = await Order.findByIdAndUpdate(id, orderData, { new: true });
    if (!order) {
      return {
        code: STATUS_CODE.BAD_REQUEST,
        success: false,
        message: "Order not found",
      };
    }
    return { code: STATUS_CODE.SUCCESS, success: true, data: order };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const deleteOrder = async (id) => {
  try {
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return {
        code: STATUS_CODE.BAD_REQUEST,
        success: false,
        message: "Order not found",
      };
    }
    return {
      code: STATUS_CODE.SUCCESS,
      success: true,
      message: "Order deleted successfully",
    };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};
