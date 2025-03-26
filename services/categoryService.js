const Category = require("../models/Category");
const { STATUS_CODE } = require("../Helper/enums");

const getAllCategories = async (req) => {
  try {
    const categories = await Category.find();
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    
    const categoriesWithFullImageUrl = categories.map(category => ({
      ...category._doc,
      image_url: category.image_url ? `${baseUrl}${category.image_url}` : null
    }));
    return { code: STATUS_CODE.SUCCESS, success: true, data: categoriesWithFullImageUrl };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const getCategoryById = async (req,id) => {
  try {
    const category = await Category.findById(id);
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    if (!category) {
      return {
        code: STATUS_CODE.BAD_REQUEST,
        success: false,
        message: "Category not found",
      };
    }
    const categoryWithFullImageUrl = {
      ...category.toObject(),
      image_url: category.image_url ? `${baseUrl}${category.image_url}` : null
    };
    return { code: STATUS_CODE.SUCCESS, success: true, data: categoryWithFullImageUrl };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return { code: STATUS_CODE.BAD_REQUEST, success: false, message: "Tên danh mục không được để trống." };
    }

    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
      return { code: STATUS_CODE.BAD_REQUEST, success: false, message: "Tên danh mục đã tồn tại." };
    }

    const imageUrl = req.file ? `/img/${req.file.filename}` : "";

    const category = await Category.create({ name: name.trim(), image_url: imageUrl });

    return { code: STATUS_CODE.SUCCESS, success: true, data: category };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const updateCategory = async (req, id, categoryData) => {
  try {
    // Kiểm tra category tồn tại
    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return {
        code: STATUS_CODE.BAD_REQUEST,
        success: false,
        message: "Category not found",
      };
    }

    // Xử lý ảnh mới nếu có
    if (req.file) {
      categoryData.image_url = `/img/${req.file.filename}`;
    }

    const category = await Category.findByIdAndUpdate(id, categoryData, {
      new: true,
    });

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const categoryWithFullImageUrl = {
      ...category.toObject(),
      image_url: category.image_url ? `${baseUrl}${category.image_url}` : null
    };
    console.log(
      { code: STATUS_CODE.SUCCESS, success: true, data: categoryWithFullImageUrl }
    );

    return { code: STATUS_CODE.SUCCESS, success: true, data: categoryWithFullImageUrl };
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
