const express = require("express");
const newsController = require("../controllers/newsController");
const upload = require("../middleware/upload");

const router = express.Router();

router.get("/getAll", newsController.getAllNews);
router.get("/get/:id", newsController.getNewsById);
router.post("/create", upload.single("image"), newsController.createNews);
router.post("/update/:id", upload.single("image"), newsController.updateNews);
router.post("/search", newsController.searchNews);
router.delete("/delete/:id", newsController.deleteNews);

module.exports = router;
