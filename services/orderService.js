const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Cart = require("../models/Cart");
const { STATUS_CODE } = require("../Helper/enums");
const OrderItemService = require("./orderItemService");
const mongoose = require("mongoose");

const getAllOrders = async () => {
  try {
    const orders = await Order.find();
    return { code: STATUS_CODE.SUCCESS, success: true, data: orders };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const getAllOrdersByUser = async (userId) => {
  try {
    const objectId = new mongoose.Types.ObjectId(userId);
    const orders = await Order.find({ userId: objectId });

    return { code: STATUS_CODE.SUCCESS, success: true, data: orders };
  } catch (error) {
    return {
      code: STATUS_CODE.ERROR,
      success: false,
      message: error.message,
    };
  }
};

const getOrderById = async (orderId) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return {
        code: STATUS_CODE.BAD_REQUEST,
        success: false,
        message: "Order not found",
      };
    }
    const orderItemList = await OrderItem.find({ orderId });
    return {
      code: STATUS_CODE.SUCCESS,
      success: true,
      data: { order: order, orderItemList: orderItemList },
    };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const createOrder = async (orderData) => {
  try {
    const order = await Order.create(orderData);
    const orderId = order._id;

    for (const item of orderData.orderItemList) {
      const data = { ...item, orderId };
      await OrderItemService.createOrderItem(data);
    }

    await Cart.deleteMany({ userId: orderData.userId });

    return {
      code: STATUS_CODE.SUCCESS,
      success: true,
      data: order,
    };
  } catch (error) {
    return {
      code: STATUS_CODE.ERROR,
      success: false,
      message: error.message,
    };
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
const searchOrder = async (dataSearch) => {
  try {
    let query = {};
    if (dataSearch.status) {
      query.status = dataSearch.status;
    }

    const sortOrder = dataSearch.sort === "DESC" ? -1 : 1;
    const orders = await Order.find(query).sort({ totalAmount: sortOrder });

    return {
      code: STATUS_CODE.SUCCESS,
      success: true,
      message: "Orders retrieved successfully",
      data: orders,
    };
  } catch (error) {
    return {
      code: STATUS_CODE.ERROR,
      success: false,
      message: error.message,
      data: null,
    };
  }
};
module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  searchOrder,
  getAllOrdersByUser,
};
