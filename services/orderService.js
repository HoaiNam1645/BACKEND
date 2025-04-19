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

const getOrderById = async (req) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return {
        code: STATUS_CODE.BAD_REQUEST,
        success: false,
        message: "Order not found",
      };
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const orderItems = await OrderItem.find({ orderId: order._id }).populate(
      "productId"
    );

    const orderItemList = orderItems.map((item) => ({
      _id: item._id,
      quantity: item.quantity,
      productId: item.productId?._id,
      name: item.productId?.name,
      price: item.productId?.price,
      image_url: item.productId?.image_url
        ? `${baseUrl}${item.productId.image_url}`
        : null,
    }));

    return {
      code: STATUS_CODE.SUCCESS,
      success: true,
      data: { order, orderItemList },
    };
  } catch (error) {
    return {
      code: STATUS_CODE.ERROR,
      success: false,
      message: error.message,
    };
  }
};

const createOrder = async (req) => {
  try {
    const orderData = req.body;
    const order = await Order.create(orderData);
    const orderId = order._id;

    for (const item of orderData.orderItemList) {
      const data = { ...item, orderId };
      await OrderItemService.createOrderItem(req, data);
    }

    const userObjectId = new mongoose.Types.ObjectId(orderData.userId);
    await Cart.deleteMany({ userId: userObjectId });

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

const updateStatusOrder = async (orderId, status) => {
  try {
    const objectId = new mongoose.Types.ObjectId(orderId);

    const updatedOrder = await Order.findByIdAndUpdate(
      objectId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return {
        code: STATUS_CODE.BAD_REQUEST,
        success: false,
        message: "Order not found",
        data: null,
      };
    }

    return {
      code: STATUS_CODE.SUCCESS,
      success: true,
      message: "Order status updated successfully",
      data: updatedOrder,
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
  updateStatusOrder,
};
