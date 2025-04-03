const Cart = require("../models/Cart");
const { STATUS_CODE } = require("../Helper/enums");

const getAllCarts = async () => {
  try {
    const carts = await Cart.find();
    return { code: STATUS_CODE.SUCCESS, success: true, data: carts };
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
