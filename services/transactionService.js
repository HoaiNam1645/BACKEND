const Transaction = require("../models/Transaction");
const { STATUS_CODE } = require("../Helper/enums");

const getAllTransactions = async () => {
  try {
    const transactions = await Transaction.find();
    return { code: STATUS_CODE.SUCCESS, success: true, data: transactions };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const getTransactionById = async (id) => {
  try {
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return {
        code: STATUS_CODE.NOT_FOUND,
        success: false,
        message: "Transaction not found",
      };
    }
    return { code: STATUS_CODE.SUCCESS, success: true, data: transaction };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const createTransaction = async (transactionData) => {
  try {
    const transaction = await Transaction.create(transactionData);
    return { code: STATUS_CODE.SUCCESS, success: true, data: transaction };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const updateTransaction = async (id, transactionData) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      id,
      transactionData,
      { new: true }
    );
    if (!transaction) {
      return {
        code: STATUS_CODE.NOT_FOUND,
        success: false,
        message: "Transaction not found",
      };
    }
    return { code: STATUS_CODE.SUCCESS, success: true, data: transaction };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const deleteTransaction = async (id) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(id);
    if (!transaction) {
      return {
        code: STATUS_CODE.NOT_FOUND,
        success: false,
        message: "Transaction not found",
      };
    }
    return {
      code: STATUS_CODE.SUCCESS,
      success: true,
      message: "Transaction deleted successfully",
    };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

module.exports = {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
