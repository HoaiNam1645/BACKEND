const News = require("../models/News");
const { STATUS_CODE } = require("../Helper/enums");

const getAllNews = async (req) => {
  try {
    const newsList = await News.find();
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    
    const newsWithFullImageUrl = newsList.map(news => ({
      ...news._doc,
      imageUrl: news.imageUrl ? `${baseUrl}${news.imageUrl}` : null
    }));
    
    return { code: STATUS_CODE.SUCCESS, success: true, data: newsWithFullImageUrl };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const getNewsById = async (req, id) => {
  try {
    const news = await News.findById(id);
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    
    if (!news) {
      return {
        code: STATUS_CODE.BAD_REQUEST,
        success: false,
        message: "News not found",
      };
    }
    
    const newsWithFullImageUrl = {
      ...news.toObject(),
      imageUrl: news.imageUrl ? `${baseUrl}${news.imageUrl}` : null
    };
    
    return { code: STATUS_CODE.SUCCESS, success: true, data: newsWithFullImageUrl };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const createNews = async (req) => {
  try {
    const { title, content, author } = req.body;
    
    if (!title || !content || !author) {
      return { code: STATUS_CODE.BAD_REQUEST, success: false, message: "Title, content and author are required." };
    }

    const imageUrl = req.file ? `/img/${req.file.filename}` : "";
    
    const news = await News.create({ 
      title, 
      content, 
      author, 
      imageUrl 
    });
    
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const newsWithFullImageUrl = {
      ...news.toObject(),
      imageUrl: news.imageUrl ? `${baseUrl}${news.imageUrl}` : null
    };
    
    return { code: STATUS_CODE.SUCCESS, success: true, data: newsWithFullImageUrl };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const updateNews = async (req, id) => {
  try {
    const existingNews = await News.findById(id);
    if (!existingNews) {
      return {
        code: STATUS_CODE.BAD_REQUEST,
        success: false,
        message: "News not found",
      };
    }
    
    const newsData = req.body;
    
    if (req.file) {
      newsData.imageUrl = `/img/${req.file.filename}`;
    }
    
    const news = await News.findByIdAndUpdate(id, newsData, { new: true });
    
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const newsWithFullImageUrl = {
      ...news.toObject(),
      imageUrl: news.imageUrl ? `${baseUrl}${news.imageUrl}` : null
    };
    
    return { code: STATUS_CODE.SUCCESS, success: true, data: newsWithFullImageUrl };
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

const searchNews = async (searchData) => {
  try {
    let query = {};

    if (searchData.searchParam) {
      query.$or = [
        { title: { $regex: searchData.searchParam, $options: "i" } },
        { author: { $regex: searchData.searchParam, $options: "i" } },
      ];
    }
    const news = await News.find(query).sort({ author: 1 });

    return {
      code: STATUS_CODE.SUCCESS,
      success: true,
      message: "News retrieved successfully",
      data: news,
    };
  } catch (error) {
    return {
      code: STATUS_CODE.ERROR,
      success: false,
      message: error.message,
      data: null,
    };
  }
};

module.exports = {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  searchNews,
};
