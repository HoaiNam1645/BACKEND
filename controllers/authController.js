const authService = require("../services/authService");

const register = async (req, res) => {
  const result = await authService.register(req.body);
  return res.status(result.code).json(result);
};

const login = async (req, res) => {
  const result = await authService.login(req.body);
  return res.status(result.code).json(result);
};

module.exports = { register, login };
