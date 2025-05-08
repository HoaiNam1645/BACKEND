const authService = require("../services/authService");
const passport = require("passport");

const register = async (req, res) => {
  const result = await authService.register(req.body);
  return res.status(result.code).json(result);
};

const login = async (req, res) => {
  const result = await authService.login(req.body);
  return res.status(result.code).json(result);
};

const googleCallback = async (req, res) => {
  try {
    const result = await authService.googleAuth(req.user)
    return res.status(result.code).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
      error: error.message
    });
  }
};

module.exports = { register, login, googleCallback };
