const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const { STATUS_CODE, ORDER_STATUS } = require("../Helper/enums");
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
    if (dataSearch.searchQuery) {
      query.$or = [
        { phoneNumber: { $regex: dataSearch.searchQuery, $options: "i" } },
        { address: { $regex: dataSearch.searchQuery, $options: "i" } },
        { recipientName: { $regex: dataSearch.searchQuery, $options: "i" } },
      ];
    }

    const sortOrder = dataSearch.sort === "DESC" ? -1 : 1;
    const orders = await Order.find(query).sort({ status: sortOrder });

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

const getSalesStatistics = async (dateData, req) => {
  try {
    const startDate = new Date(dateData.startDate);
    const endDate = new Date(dateData.endDate);

    if (isNaN(startDate) || isNaN(endDate)) {
      return {
        code: STATUS_CODE.BAD_REQUEST,
        success: false,
        message: "Invalid date range provided.",
      };
    }

    const validOrders = await Order.find({
      status: { $nin: [ORDER_STATUS.PENDING, ORDER_STATUS.CANCELED] },
      createdAt: { $gte: startDate, $lte: endDate },
    }).select("_id");

    const orderIds = validOrders.map((order) => order._id);

    // Lấy 10 sản phẩm bán chạy nhất trong khoảng thời gian đã cho
    const topProducts = await OrderItem.aggregate([
      {
        $match: {
          orderId: { $in: orderIds },
        },
      },
      {
        $group: {
          _id: "$productId", // nhóm theo productId
          totalQuantitySold: { $sum: "$quantity" }, // tổng số lượng bán được
        },
      },
      { $sort: { totalQuantitySold: -1 } }, // sắp xếp giảm dần theo số lượng bán
      { $limit: 10 }, // chỉ lấy top 10 sản phẩm bán chạy nhất
    ]);

    // Lấy thông tin sản phẩm từ bảng Product bao gồm name và image_url
    const productIds = topProducts.map((product) => product._id);
    const products = await Product.find({
      _id: { $in: productIds },
    }).select("name image_url");

    // Kết hợp thông tin từ OrderItem với thông tin từ Product
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const topProductsWithDetails = topProducts.map((product) => {
      const productInfo = products.find(
        (prod) => prod._id.toString() === product._id.toString()
      );
      return {
        productId: product._id,
        name: productInfo?.name || "Unknown Product",
        image_url: productInfo?.image_url
          ? `${baseUrl}${productInfo.image_url}`
          : null,
        totalQuantitySold: product.totalQuantitySold,
      };
    });

    // Thống kê doanh thu theo tháng
    const monthlyStats = await Order.aggregate([
      {
        $match: {
          status: { $nin: [ORDER_STATUS.PENDING, ORDER_STATUS.CANCELED] },
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    return {
      code: STATUS_CODE.SUCCESS,
      success: true,
      data: {
        monthlyStats,
        topProducts: topProductsWithDetails,
      },
    };
  } catch (error) {
    console.error("Error fetching sales statistics:", error);
    return {
      code: STATUS_CODE.ERROR,
      success: false,
      message: error.message,
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
  getSalesStatistics,
};
