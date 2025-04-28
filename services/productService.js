const Product = require("../models/Product");
const { STATUS_CODE } = require("../Helper/enums");
const ReviewService = require("./reviewService");

const getAllProducts = async (req) => {
  try {
    const categoryId = req.query.category;

    const query = categoryId ? { categoryId } : {};

    const products = await Product.find(query);

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const productsWithFullImageUrl = products.map((product) => ({
      ...product._doc,
      image_url: product.image_url ? `${baseUrl}${product.image_url}` : null,
    }));

    return {
      code: STATUS_CODE.SUCCESS,
      success: true,
      data: productsWithFullImageUrl,
    };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const getProductById = async (req, id) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const product = await Product.findById(id)
      .populate("categoryId", "name") 
      .lean(); 

    if (!product) {
      return {
        code: STATUS_CODE.BAD_REQUEST,
        success: false,
        message: "Product not found",
      };
    }

    const productWithFullImageUrl = {
      ...product,
      image_url: product.image_url ? `${baseUrl}${product.image_url}` : null,
      categoryName: product.categoryId ? product.categoryId.name : null, 
    };

    const reviews = await ReviewService.getAllReviewsByProductId(id, baseUrl);

    return {
      code: STATUS_CODE.SUCCESS,
      success: true,
      data: productWithFullImageUrl,
      reviews: reviews,
    };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, categoryId } = req.body;

    if (!name || !description || !price || !stock || !categoryId) {
      return {
        code: STATUS_CODE.BAD_REQUEST,
        success: false,
        message: "Vui lòng điền đầy đủ thông tin.",
      };
    }

    const existingProduct = await Product.findOne({ name: name.trim() });
    if (existingProduct) {
      return {
        code: STATUS_CODE.BAD_REQUEST,
        success: false,
        message: "Tên sản phẩm đã tồn tại.",
      };
    }

    const imageUrl = req.file ? `/img/${req.file.filename}` : "";

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      categoryId,
      image_url: imageUrl,
    });

    return { code: STATUS_CODE.SUCCESS, success: true, data: product };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const updateProduct = async (req, id, productData) => {
  try {
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return {
        code: STATUS_CODE.BAD_REQUEST,
        success: false,
        message: "Product not found",
      };
    }

    if (req.file) {
      productData.image_url = `/img/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, productData, {
      new: true,
    });

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const productWithFullImageUrl = {
      ...updatedProduct.toObject(),
      image_url: updatedProduct.image_url
        ? `${baseUrl}${updatedProduct.image_url}`
        : null,
    };

    return {
      code: STATUS_CODE.SUCCESS,
      success: true,
      data: productWithFullImageUrl,
    };
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
