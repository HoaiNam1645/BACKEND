const transactionService = require("../services/transactionService");

const getAllTransactions = async (req, res) => {
  const result = await transactionService.getAllTransactions();
  return res.status(result.code).json(result);
};

const getTransactionById = async (req, res) => {
  const result = await transactionService.getTransactionById(req.params.id);
  return res.status(result.code).json(result);
};

const createTransaction = async (req, res) => {
  const result = await transactionService.createTransaction(req.body);
  return res.status(result.code).json(result);
};

const updateTransaction = async (req, res) => {
  const result = await transactionService.updateTransaction(
    req.params.id,
    req.body
  );
  return res.status(result.code).json(result);
};

const deleteTransaction = async (req, res) => {
  const result = await transactionService.deleteTransaction(req.params.id);
  return res.status(result.code).json(result);
};

const searchTransaction = async (req, res) => {
  const result = await transactionService.searchTransaction(req.body);
  return res.status(result.code).json(result);
};

module.exports = {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  searchTransaction,
};
