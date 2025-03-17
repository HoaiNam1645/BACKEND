const express = require("express");
const transactionController = require("../controllers/transactionController");

const router = express.Router();

router.get("/getAll", transactionController.getAllTransactions);
router.get("/get/:id", transactionController.getTransactionById);
router.post("/create", transactionController.createTransaction);
router.post("/update/:id", transactionController.updateTransaction); // Dùng POST thay vì PUT
router.delete("/delete/:id", transactionController.deleteTransaction);

module.exports = router;
