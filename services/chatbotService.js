const ChatbotMessage = require("../models/chatbotMessage");
const Product = require("../models/Product");
const Category = require("../models/Category");
const User = require("../models/User");
const { STATUS_CODE } = require("../Helper/enums");
const { openai } = require("../config/openai");
// const mongoose = require("mongoose");

const getChatHistory = async (userId) => {
  try {
    // if (!mongoose.Types.ObjectId.isValid(userId)) {
    //   return {
    //     code: 400,
    //     success: false,
    //     message: "Invalid userId!",
    //   };
    // }
    let chat = await ChatbotMessage.findOne({
      userId: userId,
    });
    const user = await User.findById(userId);

    if (!chat) {
      chat = new ChatbotMessage({
        userId,
        messages: [
          {
            role: "system",
            content: `Xin chào ${user.fullName}!! Mình là trợ lý ảo của cửa hàng bán hàng công nghệ. Bạn đang tìm kiếm sản phẩm công nghệ nào ạ? Mình có thể tư vấn giúp bạn chọn lựa phù hợp nhất! Hoặc nếu muốn thì bạn có thể tán gẫu với mình... 😊`,
          },
        ],
      });
      await chat.save();
    }
    return { code: STATUS_CODE.SUCCESS, success: true, data: chat.messages };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const sendMessage = async (userId, userMessage) => {
  try {
    let chat = await ChatbotMessage.findOne({
      userId: userId,
    });

    if (!chat) {
      chat = new ChatbotMessage({ userId, messages: [] });
    }

    const intentResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Bạn là một mô hình AI giúp xác định xem một câu hỏi có liên quan đến tư vấn sản phẩm hay không. Nếu câu hỏi liên quan đến sản phẩm, trả lời 'product'. Nếu không, trả lời 'general'.",
        },
        { role: "user", content: `Câu hỏi: ${userMessage}` },
      ],
      temperature: 0.8,
    });

    const intent =
      intentResponse?.choices?.[0]?.message?.content?.trim() || "general";
    let botResponse = "";
    let messages = chat.messages.slice(-6).map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    if (chat.messages.length > 0) {
      messages.unshift({
        role: chat.messages[0].role,
        content: chat.messages[0].content,
      });
    }
    if (intent === "product") {
      const products = await Product.find()
        .populate("categoryId", "name")
        .lean();
      const categories = await Category.find().lean();

      const productList = products
        .map(
          (p) =>
            `- ${p.name} (Danh mục: ${p.categoryId?.name || "Chưa có"}): ${
              p.description
            } (Giá: ${p.price} VND) : (Số lượng: ${p.stock})`
        )
        .join("\n");
      const categoryList = categories.map((c) => `- ${c.name}`).join("\n");
      messages.unshift({
        role: "system",
        content:
          "Bạn là một trợ lý AI có thể trò chuyện và trả lời câu hỏi của khách hàng. Nếu không có sản phẩm nào phù hợp với yêu cầu khách hàng hoặc sản phẩm đã hết hàng thì hãy trả lời cho phù hợp và hãy đề nghị khách hàng hỏi lại theo hướng khác. ",
      });
      messages.push({
        role: "user",
        content: `Dưới đây là danh mục sản phẩm có sẵn:\n${categoryList}\n\nDưới đây là danh sách sản phẩm chi tiết:\n${productList}\n\nNgười dùng hỏi: "${userMessage}"`,
      });
    } else {
      messages.unshift({
        role: "system",
        content:
          "Bạn là một trợ lý AI có thể trò chuyện và trả lời câu hỏi của khách hàng.",
      });
      messages.push({ role: "user", content: userMessage });
    }
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.8,
    });
    botResponse =
      response?.choices?.[0]?.message?.content?.trim() ||
      "Xin lỗi, tôi không hiểu câu hỏi của bạn.";
    chat.messages.push({ role: "user", content: userMessage });
    chat.messages.push({ role: "system", content: botResponse });
    await chat.save();

    return {
      code: STATUS_CODE.SUCCESS,
      success: true,
      data: botResponse,
    };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const deleteChatHistory = async (userId) => {
  try {
    const result = await ChatbotMessage.findOneAndDelete({
      userId: userId,
    });

    if (!result) {
      return {
        code: STATUS_CODE.BAD_REQUEST,
        success: false,
        message: "Chat history not found!",
      };
    }

    return {
      code: STATUS_CODE.SUCCESS,
      success: true,
      message: "Chat history has been cleared!",
    };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

module.exports = {
  getChatHistory,
  sendMessage,
  deleteChatHistory,
};
