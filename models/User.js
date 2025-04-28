const mongoose = require("mongoose");
const { USER_ROLE } = require("../Helper/enums");

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: String,
    address: String,
    avatarUrl: { type: String },
    role: { type: String, enum: Object.values(USER_ROLE), default: "user" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
