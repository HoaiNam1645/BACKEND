const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/getAll", userController.getAllUsers);
router.get("/get/:id", userController.getUserById);
router.post("/create", userController.createUser);
router.post("/update/:id", userController.updateUser);
router.post("/search", userController.searchUser);
router.delete("/delete/:id", userController.deleteUser);

module.exports = router;
