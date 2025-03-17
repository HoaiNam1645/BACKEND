const OrderItem = require("../models/OrderItem");
const { STATUS_CODE } = require("../Helper/enums");

const getAllOrderItems = async () => {
  try {
    const orderItems = await OrderItem.find();
    return { code: STATUS_CODE.SUCCESS, success: true, data: orderItems };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const getOrderItemById = async (id) => {
  try {
    const orderItem = await OrderItem.findById(id);
    if (!orderItem) {
      return {
        code: STATUS_CODE.BAD_REQUEST,
        success: false,
        message: "Order item not found",
      };
    }
    return { code: STATUS_CODE.SUCCESS, success: true, data: orderItem };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const createOrderItem = async (orderItemData) => {
  try {
    const orderItem = await OrderItem.create(orderItemData);
    return { code: STATUS_CODE.SUCCESS, success: true, data: orderItem };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const updateOrderItem = async (id, orderItemData) => {
  try {
    const orderItem = await OrderItem.findByIdAndUpdate(id, orderItemData, {
      new: true,
    });
    if (!orderItem) {
      return {
        code: STATUS_CODE.BAD_REQUEST,
        success: false,
        message: "Order item not found",
      };
    }
    return { code: STATUS_CODE.SUCCESS, success: true, data: orderItem };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const deleteOrderItem = async (id) => {
  try {
    const orderItem = await OrderItem.findByIdAndDelete(id);
    if (!orderItem) {
      return {
        code: STATUS_CODE.BAD_REQUEST,
        success: false,
        message: "Order item not found",
      };
    }
    return {
      code: STATUS_CODE.SUCCESS,
      success: true,
      message: "Order item deleted successfully",
    };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

module.exports = {
  getAllOrderItems,
  getOrderItemById,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem,
};
