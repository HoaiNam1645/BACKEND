const mongoose = require("mongoose");
const { ORDER_STATUS, PAYMENT_METHOD } = require("../Helper/enums");

const OrderSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PAYMENT_METHOD),
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
