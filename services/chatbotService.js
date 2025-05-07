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

    // Lưu tin nhắn mới của user
    chat.messages.push({ role: "user", content: userMessage });

    // Lấy các tin nhắn gần nhất
    let messages = chat.messages.map(({ role, content }) => ({
      role,
      content,
    }));
    // if (chat.messages.length > 0) {
    //   messages.unshift({
    //     role: chat.messages[0].role,
    //     content: chat.messages[0].content,
    //   });
    // }

    // ==== XÁC ĐỊNH INTENT DỰA TRÊN userMessage ====
    const intentResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
            Bạn là một AI chuyên phân tích mục đích câu hỏi của người dùng.
            Phân loại câu hỏi theo 3 nhóm:
            - 'in_store' nếu người dùng hỏi về sản phẩm hiện có, muốn mua, hỏi giá, tồn kho... liên quan đến cửa hàng đang bán.
            - 'out_of_scope' nếu câu hỏi chỉ mang tính thông tin chung (ví dụ: điện thoại nào tốt, xu hướng công nghệ...)
            - 'general' nếu là câu chào hỏi, trò chuyện không liên quan đến sản phẩm.
            Chỉ trả về một từ: in_store, out_of_scope, hoặc general.
          `,
        },
        { role: "user", content: userMessage },
      ],
      temperature: 0,
    });

    const intent =
      intentResponse?.choices?.[0]?.message?.content?.trim().toLowerCase() ||
      "general";

    // ==== TẠO PROMPT TÙY THEO INTENT ====
    if (intent === "in_store") {
      const products = await Product.find({ stock: { $gt: 0 } })
        .populate("categoryId", "name")
        .lean();
      const categories = await Category.find().lean();

      const categoryList = categories.map((c) => `- ${c.name}`).join("<br>");
      const productList = products
        .map(
          (p) =>
            `<div class="product-item"><a href="/product-left-sidebar/${
              p._id
            }" target="_blank">🛒 <strong>${p.name}</strong></a> (Danh mục: ${
              p.categoryId?.name || "Chưa có"
            }): ${p.description} <b>(Giá: ${p.price} VND, Còn: ${
              p.stock
            })</b></div>`
        )
        .join("<br>");

      messages.unshift({
        role: "system",
        content: `Bạn là một trợ lý AI tư vấn sản phẩm.
        - Đoạn văn bản trả về phải được định dạng bằng HTML.
        - Không dùng thư viện, chỉ dùng CSS thuần.
        - Giữ nguyên các thẻ HTML như <div>, <a>, <strong>, class="product-item",...
        - Không được dùng markdown như [link](url).
        - Chỉ trả về các sản phẩm có liên quan đến câu hỏi của người dùng.
        - Phải thêm đoạn giới thiệu và kết thúc trong mỗi lần trả lời và mỗi lần là lời thoại khác nhau.
        - Nếu trong danh sách không có sản phẩm phù hợp với yêu cầu thì báo lại cho khách theo cách lịch sự nhất.
        - Không tự động đề xuất các sản phẩm không có trong danh sách.
        - Mọi thông tin sản phẩm bạn cung cấp **chỉ được lấy từ danh sách được cung cấp**.
        - Tuyệt đối **không tự nghĩ ra, đề xuất hay thêm các sản phẩm khác ngoài danh sách**.
        - Nếu **không có sản phẩm phù hợp**, hãy trả lời lịch sự rằng hiện tại cửa hàng chưa có sản phẩm theo yêu cầu và gợi ý người dùng thử yêu cầu khác.
        - Câu trả lời phải được định dạng HTML (ví dụ: <div>, <a>, <strong>, class="product-item"...).
        - Không sử dụng markdown (vd: [link](url)).
        - Mỗi lần trả lời phải có đoạn **mở đầu và kết thúc thân thiện, linh hoạt mỗi lần**, không lặp lại hoàn toàn.`,
      });

      messages.push({
        role: "user",
        content: `Danh mục hiện có:<br>${categoryList}<br><br>Sản phẩm liên quan:<br><div class="product-list">${productList}</div><br><br>Người dùng hỏi: "${userMessage}"`,
      });
    } else if (intent === "out_of_scope") {
      messages.unshift({
        role: "system",
        content: `Bạn là một trợ lý AI cho cửa hàng. Câu hỏi của người dùng không liên quan đến sản phẩm có trong cửa hàng, nên hãy phản hồi lịch sự rằng bạn chỉ hỗ trợ tư vấn các sản phẩm đang có trong kho.`,
      });

      messages.push({ role: "user", content: userMessage });
    } else {
      messages.unshift({
        role: "system",
        content: `Bạn là một trợ lý AI hỗ trợ trò chuyện. Nếu có hiển thị HTML (ví dụ link sản phẩm), luôn giữ nguyên định dạng HTML.`,
      });

      messages.push({ role: "user", content: userMessage });
    }

    // ==== GỌI OPENAI ĐỂ TRẢ LỜI CUỐI CÙNG ====
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      temperature: 0.8,
    });

    const botResponse =
      response?.choices?.[0]?.message?.content?.trim() ||
      "Tôi đang xử lý thông tin, bạn vui lòng hỏi lại theo cách khác nhé.";

    // ==== LƯU PHẢN HỒI VÀ TRẢ VỀ ====
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
