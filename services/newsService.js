const News = require("../models/News");
const { STATUS_CODE } = require("../Helper/enums");

const getAllNews = async () => {
  try {
    const newsList = await News.find();
    return { code: STATUS_CODE.SUCCESS, success: true, data: newsList };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const getNewsById = async (id) => {
  try {
    const news = await News.findById(id);
    if (!news) {
      return {
        code: STATUS_CODE.BAD_REQUEST,
        success: false,
        message: "News not found",
      };
    }
    return { code: STATUS_CODE.SUCCESS, success: true, data: news };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const createNews = async (newsData) => {
  try {
    const news = await News.create(newsData);
    return { code: STATUS_CODE.SUCCESS, success: true, data: news };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const updateNews = async (id, newsData) => {
  try {
    const news = await News.findByIdAndUpdate(id, newsData, { new: true });
    if (!news) {
      return {
        code: STATUS_CODE.BAD_REQUEST,
        success: false,
        message: "News not found",
      };
    }
    return { code: STATUS_CODE.SUCCESS, success: true, data: news };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const deleteNews = async (id) => {
  try {
    const news = await News.findByIdAndDelete(id);
    if (!news) {
      return {
        code: STATUS_CODE.BAD_REQUEST,
        success: false,
        message: "News not found",
      };
    }
    return {
      code: STATUS_CODE.SUCCESS,
      success: true,
      message: "News deleted successfully",
    };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

module.exports = {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
};
