// chatbotController.js
const chatbotService = require("../services/chatbotService");

const chatbotController = {
  async chat(req, res) {
    try {
      const { userId, message } = req.body;
      if (!userId || !message) {
        return res
          .status(400)
          .json({ success: false, message: "Thiếu userId hoặc message" });
      }

      const response = await chatbotService.chatWithBot(userId, message);
      return res.status(response.code).json(response);
    } catch (error) {
      console.error("Chatbot controller error:", error);
      return res.status(500).json({ success: false, message: "Lỗi server" });
    }
  },
};

module.exports = chatbotController;
