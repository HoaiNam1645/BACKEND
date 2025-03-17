const Category = require("../models/Category");
const { STATUS_CODE } = require("../Helper/enums");

const getAllCategories = async () => {
  try {
    const categories = await Category.find();
    return { code: STATUS_CODE.SUCCESS, success: true, data: categories };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const getCategoryById = async (id) => {
  try {
    const category = await Category.findById(id);
    if (!category) {
      return {
        code: STATUS_CODE.BAD_REQUEST,
        success: false,
        message: "Category not found",
      };
    }
    return { code: STATUS_CODE.SUCCESS, success: true, data: category };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const createCategory = async (categoryData) => {
  try {
    const category = await Category.create(categoryData);
    return { code: STATUS_CODE.SUCCESS, success: true, data: category };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const updateCategory = async (id, categoryData) => {
  try {
    const category = await Category.findByIdAndUpdate(id, categoryData, {
      new: true,
    });
    if (!category) {
      return {
        code: STATUS_CODE.BAD_REQUEST,
        success: false,
        message: "Category not found",
      };
    }
    return { code: STATUS_CODE.SUCCESS, success: true, data: category };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const deleteCategory = async (id) => {
  try {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return {
        code: STATUS_CODE.BAD_REQUEST,
        success: false,
        message: "Category not found",
      };
    }
    return {
      code: STATUS_CODE.SUCCESS,
      success: true,
      message: "Category deleted successfully",
    };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
