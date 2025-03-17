const ChatbotMessage = require("../models/ChatbotMessage");
const { STATUS_CODE } = require("../Helper/enums");

const getAllMessages = async () => {
  try {
    const messages = await ChatbotMessage.find();
    return { code: STATUS_CODE.SUCCESS, success: true, data: messages };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const getMessageById = async (id) => {
  try {
    const message = await ChatbotMessage.findById(id);
    if (!message) {
      return {
        code: STATUS_CODE.BAD_REQUEST,
        success: false,
        message: "Message not found",
      };
    }
    return { code: STATUS_CODE.SUCCESS, success: true, data: message };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const createMessage = async (messageData) => {
  try {
    const message = await ChatbotMessage.create(messageData);
    return { code: STATUS_CODE.SUCCESS, success: true, data: message };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const updateMessage = async (id, messageData) => {
  try {
    const message = await ChatbotMessage.findByIdAndUpdate(id, messageData, {
      new: true,
    });
    if (!message) {
      return {
        code: STATUS_CODE.BAD_REQUEST,
        success: false,
        message: "Message not found",
      };
    }
    return { code: STATUS_CODE.SUCCESS, success: true, data: message };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const deleteMessage = async (id) => {
  try {
    const message = await ChatbotMessage.findByIdAndDelete(id);
    if (!message) {
      return {
        code: STATUS_CODE.BAD_REQUEST,
        success: false,
        message: "Message not found",
      };
    }
    return {
      code: STATUS_CODE.SUCCESS,
      success: true,
      message: "Message deleted successfully",
    };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

module.exports = {
  getAllMessages,
  getMessageById,
  createMessage,
  updateMessage,
  deleteMessage,
};
