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
    const result = await authService.googleAuth(req.user);
    const token = result.data.token;
    const userData = (JSON.stringify(result.data.user));
    console.log('userData', `${process.env.FRONTEND_URL}?token=${token}&userData=${userData}`);
    return res.redirect(`${process.env.FRONTEND_URL}?token=${token}&userData=${userData}`);
  } catch (error) {
    return res.redirect(`${process.env.FRONTEND_URL}?error=${encodeURIComponent(error.message)}`);
  }
};

module.exports = { register, login, googleCallback };
