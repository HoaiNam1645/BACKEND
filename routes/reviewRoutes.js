const express = require("express");
const reviewController = require("../controllers/reviewController");

const router = express.Router();

router.get("/getAll", reviewController.getAllReviews);
router.get("/get/:id", reviewController.getReviewById);
router.post("/create", reviewController.createReview);
router.post("/update/:id", reviewController.updateReview); // Dùng POST thay vì PUT
router.delete("/delete/:id", reviewController.deleteReview);

module.exports = router;
