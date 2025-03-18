const chatbotService = require("../services/chatbotService");

const getChatHistory = async (req, res) => {
  const result = await chatbotService.getChatHistory(req.params.userId);
  return res.status(result.code).json(result);
};

const sendMessage = async (req, res) => {
  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(401).json({
      code: 401,
      success: false,
      message: "userId và message là bắt buộc",
    });
  }

  const result = await chatbotService.sendMessage(userId, message);
  return res.status(result.code).json(result);
};

const deleteChatHistory = async (req, res) => {
  const result = await chatbotService.deleteChatHistory(req.params.userId);
  return res.status(result.code).json(result);
};

module.exports = {
  getChatHistory,
  sendMessage,
  deleteChatHistory,
};
