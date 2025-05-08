const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { STATUS_CODE } = require("../Helper/enums");

const register = async (userData) => {
  try {
    const existingUser = await User.findOne({
      email: userData.email.toLowerCase(),
    });
    if (existingUser) {
      return {
        code: STATUS_CODE.BAD_REQUEST,
        success: false,
        message: "Email already exists!",
      };
    }

    userData.email = userData.email.toLowerCase();
    userData.password = await bcrypt.hash(userData.password, 10);
    const user = await User.create(userData);

    return {
      code: STATUS_CODE.SUCCESS,
      success: true,
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const login = async ({ email, password }) => {
  try {
    email = email.toLowerCase();
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return {
        code: STATUS_CODE.BAD_REQUEST,
        success: false,
        message: "Wrong email or password!",
      };
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    return {
      code: STATUS_CODE.SUCCESS,
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          avataUrl: user.avataUrl,
        },
      },
    };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const googleAuth = async (user) => {
  try {
    // Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    return {
      code: STATUS_CODE.SUCCESS,
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          avataUrl: user.avatarUrl,
        },
      },
    };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

module.exports = { register, login, googleAuth };
