const Product = require("../models/Product");
const { STATUS_CODE } = require("../Helper/enums");
const ReviewService = require("./reviewService");

const getAllProducts = async (req) => {
  try {
    const categoryId = req.query.category;
    const query = categoryId ? { categoryId } : {};

    const products = await Product.find(query);

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const productsWithFullImageUrl = await Promise.all(
      products.map(async (product) => {
        const stats = await ReviewService.getReviewStatsByProductId(
          product._id
        );
        return {
          ...product._doc,
          image_url: product.image_url
            ? `${baseUrl}${product.image_url}`
            : null,
          ratingAverage: stats.data?.average || 0,
          ratingCount: stats.data?.count || 0,
        };
      })
    );

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

    const stats = await ReviewService.getReviewStatsByProductId(id);

    const productWithFullImageUrl = {
      ...product,
      image_url: product.image_url ? `${baseUrl}${product.image_url}` : null,
      categoryName: product.categoryId ? product.categoryId.name : null,
      ratingAverage: stats.data?.average || 0,
      ratingCount: stats.data?.count || 0,
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

const searchProduct = async (req,searchData) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    let query = {};

    if (searchData.categoryId) {
      query.categoryId = searchData.categoryId;
    }

    if (searchData.name) {
      query.name = { $regex: searchData.name, $options: "i" };
    }

    const sortOrder = searchData.sort === "DESC" ? -1 : 1;
    const products = await Product.find(query).sort({ price: sortOrder });

    // Lấy thông tin đánh giá cho mỗi sản phẩm
    const productsWithRating = await Promise.all(
      products.map(async (product) => {
        const stats = await ReviewService.getReviewStatsByProductId(
          product._id
        );
        return {
          ...product._doc,
          image_url: product.image_url
            ? `${baseUrl}${product.image_url}`
            : null,
          ratingAverage: stats.data?.average || 0,
          ratingCount: stats.data?.count || 0,
        };
      })
    );

    return {
      code: STATUS_CODE.SUCCESS,
      success: true,
      message: "Products retrieved successfully",
      data: productsWithRating,
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
const getTopProducts = async (req) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    // 1. Top 10 sản phẩm bán chạy nhất
    const bestSellingProducts = await Product.find()
      .sort({ sold: -1 })
      .limit(10)
      .lean();

    const bestSellingWithImage = await Promise.all(
      bestSellingProducts.map(async (product) => {
        const stats = await ReviewService.getReviewStatsByProductId(
          product._id
        );
        return {
          ...product,
          image_url: product.image_url
            ? `${baseUrl}${product.image_url}`
            : null,
          ratingAverage: stats.data?.average || 0,
          ratingCount: stats.data?.count || 0,
        };
      })
    );

    // 2. Top 10 sản phẩm được đánh giá cao nhất
    const allProducts = await Product.find().lean();

    const productsWithRating = await Promise.all(
      allProducts.map(async (product) => {
        const stats = await ReviewService.getReviewStatsByProductId(
          product._id
        );
        return {
          ...product,
          image_url: product.image_url
            ? `${baseUrl}${product.image_url}`
            : null,
          ratingAverage: stats.data?.average || 0,
          ratingCount: stats.data?.count || 0,
        };
      })
    );

    const topRatedProducts = productsWithRating
      .filter((p) => p.ratingCount > 0)
      .sort((a, b) => b.ratingAverage - a.ratingAverage)
      .slice(0, 10);

    return {
      code: STATUS_CODE.SUCCESS,
      success: true,
      data: {
        bestSelling: bestSellingWithImage,
        topRated: topRatedProducts,
      },
    };
  } catch (error) {
    return {
      code: STATUS_CODE.ERROR,
      success: false,
      message: error.message,
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
  getTopProducts,
};
