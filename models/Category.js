const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true, trim: true },
    image_url: { type: String, default: "" }
  },
  { timestamps: true }
);


module.exports = mongoose.model("Category", CategorySchema);
