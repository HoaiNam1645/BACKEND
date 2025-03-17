const reviewService = require("../services/reviewService");

const getAllReviews = async (req, res) => {
  const result = await reviewService.getAllReviews();
  return res.status(result.code).json(result);
};

const getReviewById = async (req, res) => {
  const result = await reviewService.getReviewById(req.params.id);
  return res.status(result.code).json(result);
};

const createReview = async (req, res) => {
  const result = await reviewService.createReview(req.body);
  return res.status(result.code).json(result);
};

const updateReview = async (req, res) => {
  const result = await reviewService.updateReview(req.params.id, req.body);
  return res.status(result.code).json(result);
};

const deleteReview = async (req, res) => {
  const result = await reviewService.deleteReview(req.params.id);
  return res.status(result.code).json(result);
};

module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
};
