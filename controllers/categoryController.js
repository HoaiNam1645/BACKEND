const categoryService = require("../services/categoryService");

const getAllCategories = async (req, res) => {
  const result = await categoryService.getAllCategories(req);
  return res.status(result.code).json(result);
};

const getCategoryById = async (req, res) => {
  const result = await categoryService.getCategoryById(req,req.params.id);
  return res.status(result.code).json(result);
};

const createCategory = async (req, res) => {
  const result = await categoryService.createCategory(req,res);
  return res.status(result.code).json(result);
};

const updateCategory = async (req, res) => {
  const result = await categoryService.updateCategory(req,req.params.id, req.body);
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
