const OrderItem = require("../models/OrderItem");
const { STATUS_CODE } = require("../Helper/enums");

const getAllOrderItems = async (req) => {
  try {
    const orderItems = await OrderItem.find();
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const orderItemsWithFullImageUrl = orderItems.map((orderItem) => ({
      ...orderItem._doc,
      image_url: orderItem.image_url
        ? `${baseUrl}${orderItem.image_url}`
        : null,
    }));
    return {
      code: STATUS_CODE.SUCCESS,
      success: true,
      data: orderItemsWithFullImageUrl,
    };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const getAllOrderItemsByOrderId = async (req) => {
  try {
    const orderId = req.params.id;

    const orderItems = await OrderItem.find({ orderId: orderId });

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const orderItemsWithFullImageUrl = orderItems.map((orderItem) => ({
      ...orderItem._doc,
      image_url: orderItem.image_url
        ? `${baseUrl}${orderItem.image_url}`
        : null,
    }));

    return {
      code: STATUS_CODE.SUCCESS,
      success: true,
      data: orderItemsWithFullImageUrl,
    };
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

const createOrderItem = async (req) => {
  try {
    const imageUrl = req.file ? `/img/${req.file.filename}` : "";

    const orderItem = await OrderItem.create({
      ...req.body,
      image_url: imageUrl,
    });
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
  getAllOrderItemsByOrderId,
};
