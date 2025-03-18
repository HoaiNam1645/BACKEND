const express = require("express");
const chatbotController = require("../controllers/chatbotController");

const router = express.Router();

router.get("/history/:userId", chatbotController.getChatHistory);
router.post("/send-message", chatbotController.sendMessage);
router.delete("/history/:userId", chatbotController.deleteChatHistory);

module.exports = router;
