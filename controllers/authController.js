const { MsgCode } = require("../Helper/messageCode");
const { registerUser, loginUser } = require("../services/authService");

const register = async (req, res) => {
  try {
    const response = await registerUser(req.body);

    return res.status(201).json({
      code: 201,
      success: true,
      msg_code: "User registration successful",
      data: response,
    });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      success: false,
      msg_code: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const response = await loginUser(req.body);
    
    return res.status(200).json({
      code: 200,
      success: true,
      msg_code: "Login successful",
      data: response,
    });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      success: false,
      msg_code: error.message,
    });
  }
};

module.exports = { register, login };
