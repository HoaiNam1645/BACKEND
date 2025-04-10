const express = require("express");
const orderController = require("../controllers/orderController");

const router = express.Router();

router.get("/getAll", orderController.getAllOrders);
router.get("/getAllByUser/:id", orderController.getAllOrders);
router.get("/get/:id", orderController.getOrderById);
router.post("/create", orderController.createOrder);
router.post("/update/:id", orderController.updateOrder);
router.post("/search", orderController.searchOrder);
router.delete("/delete/:id", orderController.deleteOrder);

module.exports = router;
