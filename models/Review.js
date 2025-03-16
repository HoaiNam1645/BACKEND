const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    product_id: {
      type: String,
      required: true,
    },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", ReviewSchema);
