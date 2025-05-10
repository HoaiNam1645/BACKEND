const Cart = require("../models/Cart");
const { STATUS_CODE } = require("../Helper/enums");

const getAllCarts = async (req) => {
  try {
    const carts = await Cart.find({ userId: req.params.id }).populate(
      "productId"
    );
      // if (carts.length == 0) {
      //   return {
      //     code: STATUS_CODE.BAD_REQUEST,
      //     success: true,
      //     message: "Order not found",
      //   };
      // }
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const cartWithProductInfo = carts.map((cart) => ({
      _id: cart._id,
      userId: cart.userId,
      productId: cart.productId._id,
      quantity: cart.quantity,
      image_url: cart.productId.image_url
        ? `${baseUrl}${cart.productId.image_url}`
        : null,
      name: cart.productId.name,
      price: cart.productId.price,
    }));

    return {
      code: STATUS_CODE.SUCCESS,
      success: true,
      data: cartWithProductInfo,
    };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const getCartById = async (id) => {
  try {
    const cart = await Cart.findById(id);

    if (!cart) {
      return {
        code: STATUS_CODE.BAD_REQUEST,
        success: false,
        message: "Cart not found",
      };
    }
    return { code: STATUS_CODE.SUCCESS, success: true, data: cart };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const createCart = async (cartData) => {
  try {
    const userId = cartData.userId;
    const productId = cartData.productId;
    const quantity = cartData.quantity;
    let cart = await Cart.findOne({ userId, productId });

    if (cart) {
      cart.quantity += quantity;
      await cart.save();
    } else {
      cart = new Cart({ userId, productId, quantity });
      await cart.save();
    }
    return { code: STATUS_CODE.SUCCESS, success: true, data: cart };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const updateCart = async (id, cartData) => {
  try {
    const cart = await Cart.findByIdAndUpdate(id, cartData, { new: true });
    if (!cart) {
      return {
        code: STATUS_CODE.BAD_REQUEST,
        success: false,
        message: "Cart not found",
      };
    }
    return { code: STATUS_CODE.SUCCESS, success: true, data: cart };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const deleteCart = async (id) => {
  try {
    const cart = await Cart.findByIdAndDelete(id);
    if (!cart) {
      return {
        code: STATUS_CODE.BAD_REQUEST,
        success: false,
        message: "Cart not found",
      };
    }
    return {
      code: STATUS_CODE.SUCCESS,
      success: true,
      message: "Cart deleted successfully",
    };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const clearCart = async (idUser) => {
  try {
    const result = await Cart.deleteMany(idUser);
    return {
      code: STATUS_CODE.SUCCESS,
      success: true,
      message: "Cart clear successfully",
      data: result,
    };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

module.exports = {
  getAllCarts,
  getCartById,
  createCart,
  updateCart,
  deleteCart,
  clearCart,
};
