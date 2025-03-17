const express = require("express");
const chatbotMessageController = require("../controllers/chatbotMessageController");

const router = express.Router();

router.get("/getAll", chatbotMessageController.getAllMessages);
router.get("/get/:id", chatbotMessageController.getMessageById);
router.post("/create", chatbotMessageController.createMessage);
router.post("/update/:id", chatbotMessageController.updateMessage); // Dùng POST thay vì PUT
router.delete("/delete/:id", chatbotMessageController.deleteMessage);

module.exports = router;
