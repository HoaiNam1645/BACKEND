const mongoose = require("mongoose");
const { TRANSACTION_STATUS } = require("../Helper/enums");

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
      enum: Object.values(TRANSACTION_STATUS),
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
