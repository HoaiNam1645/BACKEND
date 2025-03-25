const express = require("express");
const productController = require("../controllers/productController");

const router = express.Router();

router.get("/getAll", productController.getAllProducts);
router.get("/get/:id", productController.getProductById);
router.post("/create", productController.createProduct);
router.post("/update/:id", productController.updateProduct);
router.post("/search", productController.searchProduct);
router.delete("/delete/:id", productController.deleteProduct);

module.exports = router;
