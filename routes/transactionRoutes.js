const express = require("express");
const transactionController = require("../controllers/transactionController");

const router = express.Router();

router.get("/getAll", transactionController.getAllTransactions);
router.get("/get/:id", transactionController.getTransactionById);
router.post("/create", transactionController.createTransaction);
router.post("/update/:id", transactionController.updateTransaction);
router.delete("/delete/:id", transactionController.deleteTransaction);
router.post("/search", transactionController.searchTransaction);

module.exports = router;
