const express = require("express");
const userController = require("../controllers/userController");
const upload = require("../middleware/upload");

const router = express.Router();

router.get("/getAll", userController.getAllUsers);
router.get("/get/:id", userController.getUserById);
router.post("/create", userController.createUser);
router.post("/update/:id", upload.single("avatarUrl"), userController.updateUser);
router.post("/search", userController.searchUser);
router.delete("/delete/:id", userController.deleteUser);

module.exports = router;
