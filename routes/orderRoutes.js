const express = require("express");
const orderController = require("../controllers/orderController");

const router = express.Router();

router.get("/getAll", orderController.getAllOrders);
router.get("/get/:id", orderController.getOrderById);
router.post("/create", orderController.createOrder);
router.post("/update/:id", orderController.updateOrder); // Dùng POST thay vì PUT
router.delete("/delete/:id", orderController.deleteOrder);

module.exports = router;
