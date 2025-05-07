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
    // Tìm hoặc tạo đoạn chat
    let chat = await ChatbotMessage.findOne({ userId });
    if (!chat) {
      chat = new ChatbotMessage({ userId, messages: [] });
    }

    // Lưu tin nhắn user mới nhất
    chat.messages.push({ role: "user", content: userMessage });

    // Lấy các tin nhắn gần nhất (tối đa 6) + tin nhắn đầu tiên
    let messages = chat.messages.slice(-6).map(({ role, content }) => ({ role, content }));
    if (chat.messages.length > 0) {
      messages.unshift({
        role: chat.messages[0].role,
        content: chat.messages[0].content,
      });
    }

    // Lấy toàn bộ nội dung user đã nhắn
    const m2 = chat.messages
      .filter((msg) => msg.role === "user")
      .map((msg) => msg.content);

    // Gọi OpenAI để xác định intent
    const intentResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Bạn là một mô hình AI giúp xác định xem một câu hỏi có liên quan đến tư vấn sản phẩm hay không. Nếu câu hỏi liên quan đến sản phẩm, trả lời 'product'. Nếu không, trả lời 'general'.",
        },
        { role: "user", content: m2.join("\n") },
      ],
      temperature: 0.3,
    });

    const intent =
      intentResponse?.choices?.[0]?.message?.content?.trim().toLowerCase() || "general";
    console.log(intent);
    // Tạo prompt tùy theo intent
    if (intent === "product") {
      const products = await Product.find({ stock: { $gt: 0 } })
        .populate("categoryId", "name")
        .lean();
      const categories = await Category.find().lean();

      const categoryList = categories.map((c) => `- ${c.name}`).join("<br>");
      const productList = products
        .map(
          (p) =>
            `<div class="product-item"><a href="/product-left-sidebar/${p._id}" target="_blank">🛒 <strong>${p.name}</strong></a> (Danh mục: ${p.categoryId?.name || "Chưa có"}): ${p.description} <b>(Giá: ${p.price} VND, Còn: ${p.stock})</b></div>`
        )
        .join("<br>");

      messages.unshift({
        role: "system",
        content: `Bạn là một trợ lý AI tư vấn sản phẩm. 
        - Đoạn văn bản trả về phải được định dạng bằng HTML.
        - Không dùng thư viện, chỉ dùng css thuần.
        - Giữ nguyên các thẻ HTML như <div>, <a>, <strong>, class="product-item",... để frontend áp dụng CSS.
        - Không được dùng markdown như [link](url).
        - Chỉ trả về các sản phẩm có liên quan đến câu hỏi của người dùng và các sản phẩm còn hàng trong product list mà user cung cấp.`,
      });

      messages.push({
        role: "user",
        content: `Danh mục hiện có:<br>${categoryList}<br><br>Sản phẩm nổi bật:<br><div class="product-list">${productList}</div><br><br>Người dùng hỏi: "${userMessage}"`,
      });
    } else {
      messages.unshift({
        role: "system",
        content: `Bạn là một trợ lý AI hỗ trợ trò chuyện. Nếu có hiển thị HTML (ví dụ link sản phẩm), luôn giữ nguyên định dạng HTML.`,
      });

      messages.push({ role: "user", content: userMessage });
    }

    // Gọi OpenAI để lấy câu trả lời cuối cùng
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      temperature: 0.8,
    });

    const botResponse =
      response?.choices?.[0]?.message?.content?.trim() ||
      "Tôi đang xử lý thông tin, bạn vui lòng hỏi lại theo cách khác nhé.";

    // Lưu phản hồi vào chat
    chat.messages.push({ role: "system", content: botResponse });
    await chat.save();

    return {
      code: STATUS_CODE.SUCCESS,
      success: true,
      data: botResponse,
    };
  } catch (error) {
    console.error("sendMessage error:", error);
    return {
      code: STATUS_CODE.ERROR,
      success: false,
      message: error.message,
    };
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
