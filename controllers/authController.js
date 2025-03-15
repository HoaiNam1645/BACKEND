const { registerUser, loginUser } = require("../services/authService");

const register = async (req, res) => {
  try {
    const response = await registerUser(req.body);
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const response = await loginUser(req.body);
    res.json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { register, login };
