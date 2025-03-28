const categoryService = require("../services/categoryService");

const getAllCategories = async (req, res) => {
  const result = await categoryService.getAllCategories();
  return res.status(result.code).json(result);
};

const getCategoryById = async (req, res) => {
  const result = await categoryService.getCategoryById(req.params.id);
  return res.status(result.code).json(result);
};

const createCategory = async (req, res) => {
  const result = await categoryService.createCategory(req.body);
  return res.status(result.code).json(result);
};

const updateCategory = async (req, res) => {
  const result = await categoryService.updateCategory(req.params.id, req.body);
  return res.status(result.code).json(result);
};

const deleteCategory = async (req, res) => {
  const result = await categoryService.deleteCategory(req.params.id);
  return res.status(result.code).json(result);
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
