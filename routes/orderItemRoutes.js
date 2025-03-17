const express = require("express");
const orderItemController = require("../controllers/orderItemController");

const router = express.Router();

router.get("/getAll", orderItemController.getAllOrderItems);
router.get("/get/:id", orderItemController.getOrderItemById);
router.post("/create", orderItemController.createOrderItem);
router.post("/update/:id", orderItemController.updateOrderItem); // Dùng POST thay vì PUT
router.delete("/delete/:id", orderItemController.deleteOrderItem);

module.exports = router;
