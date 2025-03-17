// chatbotService.js
const OpenAI = require("openai");
const Message = require("../models/messageModel");
const Product = require("../models/productModel");
const STATUS_CODE = require("../utils/statusCode");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const chatbotService = {
    async chatWithBot(userId, message) {
        try {
            // Lưu tin nhắn của khách hàng vào database
            const userMessage = new Message({ userId, sender: "user", text: message });
            await userMessage.save();

            // Kiểm tra xem tin nhắn có liên quan đến sản phẩm không
            const products = await Product.find();
            let productInfo = "";
            products.forEach(product => {
                if (message.toLowerCase().includes(product.name.toLowerCase())) {
                    productInfo += `Tên: ${product.name}, Giá: ${product.price}, Mô tả: ${product.description}\n`;
                }
            });
            
            const prompt = productInfo 
                ? `Khách hàng hỏi: "${message}". Dưới đây là thông tin sản phẩm liên quan:\n${productInfo}\nHãy trả lời khách hàng một cách tự nhiên.`
                : `Khách hàng hỏi: "${message}". Hãy trả lời một cách tự nhiên.`;

            // Gọi OpenAI API để tạo câu trả lời
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "system", content: "Bạn là một chatbot hỗ trợ khách hàng chuyên nghiệp." }, { role: "user", content: prompt }],
            });

            const botReply = response.choices[0].message.content;

            // Lưu tin nhắn của chatbot vào database
            const botMessage = new Message({ userId, sender: "bot", text: botReply });
            await botMessage.save();

            return { code: STATUS_CODE.SUCCESS, success: true, message: "OK", data: botReply };
        } catch (error) {
            console.error("Chatbot error:", error);
            return { code: STATUS_CODE.SERVER_ERROR, success: false, message: "Lỗi server", data: null };
        }
    }
};

module.exports = chatbotService;
