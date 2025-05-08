const express = require("express");
const productController = require("../controllers/productController");
const upload = require("../middleware/upload");
const router = express.Router();

router.get("/getAll", productController.getAllProducts);
router.get("/get/:id", productController.getProductById);
router.post("/create", upload.single("image"), productController.createProduct);
router.post("/update/:id", upload.single("image"), productController.updateProduct);
router.post("/search", productController.searchProduct);
router.delete("/delete/:id", productController.deleteProduct);
router.get("/top", productController.getTopProducts);

module.exports = router;
