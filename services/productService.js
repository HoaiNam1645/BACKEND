const Product = require("../models/Product");
const { STATUS_CODE } = require("../Helper/enums");

const getAllProducts = async () => {
  try {
    const products = await Product.find();
    return { code: STATUS_CODE.SUCCESS, success: true, data: products };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const getProductById = async (id) => {
  try {
    const product = await Product.findById(id);
    if (!product) {
      return {
        code: STATUS_CODE.BAD_REQUEST,
        success: false,
        message: "Product not found",
      };
    }
    return { code: STATUS_CODE.SUCCESS, success: true, data: product };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const createProduct = async (productData) => {
  try {
    const product = await Product.create(productData);
    return { code: STATUS_CODE.SUCCESS, success: true, data: product };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const updateProduct = async (id, productData) => {
  try {
    const product = await Product.findByIdAndUpdate(id, productData, {
      new: true,
    });
    if (!product) {
      return {
        code: STATUS_CODE.BAD_REQUEST,
        success: false,
        message: "Product not found",
      };
    }
    return { code: STATUS_CODE.SUCCESS, success: true, data: product };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const deleteProduct = async (id) => {
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return {
        code: STATUS_CODE.BAD_REQUEST,
        success: false,
        message: "Product not found",
      };
    }
    return {
      code: STATUS_CODE.SUCCESS,
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const searchProduct = async (searchData) => {
  try {
    let query = {};

    if (searchData.categoryId) {
      query.categoryId = searchData.categoryId;
    }

    if (searchData.name) {
      query.name = { $regex: searchData.name, $options: "i" };
    }
    const sortOrder = searchData.sort === "DESC" ? -1 : 1;
    const products = await Product.find(query).sort({ price: sortOrder });

    return {
      code: STATUS_CODE.SUCCESS,
      success: true,
      message: "Products retrieved successfully",
      data: products,
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
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProduct,
};
