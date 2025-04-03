const express = require("express");
const cartController = require("../controllers/cartController");

const router = express.Router();

router.get("/getAll", cartController.getAllCarts);
router.get("/get/:id", cartController.getCartById);
router.post("/create", cartController.createCart);
router.post("/update/:id", cartController.updateCart);
router.delete("/delete/:id", cartController.deleteCart);
router.delete("/clear/:id", cartController.clearCart);

module.exports = router;
