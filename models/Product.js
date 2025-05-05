const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    image_url: { type: String, default: "" },
    type: { type: Number },
    sold: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
