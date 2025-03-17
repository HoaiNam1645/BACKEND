const mongoose = require("mongoose");

const AIRecommentSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    product_id: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("AIRecomment", AIRecommentSchema);
