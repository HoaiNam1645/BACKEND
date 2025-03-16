const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    order_id: {
      type: String,
      required: true,
    },
    user_id: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
