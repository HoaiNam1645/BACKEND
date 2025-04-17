const mongoose = require("mongoose");
const { ORDER_STATUS, PAYMENT_METHOD } = require("../Helper/enums");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalAmount: { type: Number, required: true },
    address: { type: String },
    phoneNumber: { type: String },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: "pending",
    },
    recipientName: { type: String },
    paymentMethod: {
      type: String,
      enum: Object.values(PAYMENT_METHOD),
      default: "credit_card",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
