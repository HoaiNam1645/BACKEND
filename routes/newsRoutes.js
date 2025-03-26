const express = require("express");
const newsController = require("../controllers/newsController");

const router = express.Router();

router.get("/getAll", newsController.getAllNews);
router.get("/get/:id", newsController.getNewsById);
router.post("/create", newsController.createNews);
router.post("/update/:id", newsController.updateNews);
router.post("/search", newsController.searchNews);
router.delete("/delete/:id", newsController.deleteNews);

module.exports = router;
