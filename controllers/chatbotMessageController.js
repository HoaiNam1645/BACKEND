const chatbotMessageService = require("../services/chatbotMessageService");

const getAllMessages = async (req, res) => {
  const result = await chatbotMessageService.getAllMessages();
  return res.status(result.code).json(result);
};

const getMessageById = async (req, res) => {
  const result = await chatbotMessageService.getMessageById(req.params.id);
  return res.status(result.code).json(result);
};

const createMessage = async (req, res) => {
  const result = await chatbotMessageService.createMessage(req.body);
  return res.status(result.code).json(result);
};

const updateMessage = async (req, res) => {
  const result = await chatbotMessageService.updateMessage(
    req.params.id,
    req.body
  );
  return res.status(result.code).json(result);
};

const deleteMessage = async (req, res) => {
  const result = await chatbotMessageService.deleteMessage(req.params.id);
  return res.status(result.code).json(result);
};

module.exports = {
  getAllMessages,
  getMessageById,
  createMessage,
  updateMessage,
  deleteMessage,
};
