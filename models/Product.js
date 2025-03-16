const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    category_id: { type: String },
    image_url: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
