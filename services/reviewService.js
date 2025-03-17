const Review = require("../models/Review");
const { STATUS_CODE } = require("../Helper/enums");

const getAllReviews = async () => {
  try {
    const reviews = await Review.find();
    return { code: STATUS_CODE.SUCCESS, success: true, data: reviews };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const getReviewById = async (id) => {
  try {
    const review = await Review.findById(id);
    if (!review) {
      return { code: STATUS_CODE.NOT_FOUND, success: false, message: "Review not found" };
    }
    return { code: STATUS_CODE.SUCCESS, success: true, data: review };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const createReview = async (reviewData) => {
  try {
    const review = await Review.create(reviewData);
    return { code: STATUS_CODE.SUCCESS, success: true, data: review };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const updateReview = async (id, reviewData) => {
  try {
    const review = await Review.findByIdAndUpdate(id, reviewData, { new: true });
    if (!review) {
      return { code: STATUS_CODE.NOT_FOUND, success: false, message: "Review not found" };
    }
    return { code: STATUS_CODE.SUCCESS, success: true, data: review };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const deleteReview = async (id) => {
  try {
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return { code: STATUS_CODE.NOT_FOUND, success: false, message: "Review not found" };
    }
    return { code: STATUS_CODE.SUCCESS, success: true, message: "Review deleted successfully" };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
};
