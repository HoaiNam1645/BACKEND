const newsService = require("../services/newsService");

const getAllNews = async (req, res) => {
  const result = await newsService.getAllNews();
  return res.status(result.code).json(result);
};

const getNewsById = async (req, res) => {
  const result = await newsService.getNewsById(req.params.id);
  return res.status(result.code).json(result);
};

const createNews = async (req, res) => {
  const result = await newsService.createNews(req.body);
  return res.status(result.code).json(result);
};

const updateNews = async (req, res) => {
  const result = await newsService.updateNews(req.params.id, req.body);
  return res.status(result.code).json(result);
};

const deleteNews = async (req, res) => {
  const result = await newsService.deleteNews(req.params.id);
  return res.status(result.code).json(result);
};

const searchNews = async (req, res) => {
  const result = await newsService.searchNews(req.body);
  return res.status(result.code).json(result);
};

module.exports = {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  searchNews,
};
