const express = require("express");
const categoryController = require("../controllers/categoryController");

const router = express.Router();

router.get("/getAll", categoryController.getAllCategories);
router.get("/get/:id", categoryController.getCategoryById);
router.post("/create", categoryController.createCategory);
router.post("/update/:id", categoryController.updateCategory); 
router.delete("/delete/:id", categoryController.deleteCategory);

module.exports = router;
