const mongoose = require("mongoose");

const ChatbotMessageSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    message: { type: String, required: true },
    response: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatbotMessage", ChatbotMessageSchema);
