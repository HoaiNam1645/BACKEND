const express = require("express");
const categoryController = require("../controllers/categoryController");
const upload = require("../middleware/upload");
const router = express.Router();

router.get("/getAll", categoryController.getAllCategories);
router.get("/get/:id", categoryController.getCategoryById);
router.post("/create", upload.single("image"), categoryController.createCategory);
router.post("/update/:id", upload.single("image") ,categoryController.updateCategory); 
router.delete("/delete/:id", categoryController.deleteCategory);

module.exports = router;
