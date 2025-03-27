const productService = require("../services/productService");

const getAllProducts = async (req, res) => {
  const result = await productService.getAllProducts(req);
  return res.status(result.code).json(result);
};

const getProductById = async (req, res) => {
  const result = await productService.getProductById(req,req.params.id);
  return res.status(result.code).json(result);
};

const createProduct = async (req, res) => {
  const result = await productService.createProduct(req,res);
  return res.status(result.code).json(result);
};

const updateProduct = async (req, res) => {
  const result = await productService.updateProduct(req,req.params.id, req.body);
  return res.status(result.code).json(result);
};

const deleteProduct = async (req, res) => {
  const result = await productService.deleteProduct(req.params.id);
  return res.status(result.code).json(result);
};

const searchProduct = async (req, res) => {
  const result = await productService.searchProduct(req.body);
  return res.status(result.code).json(result);
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProduct,
};
