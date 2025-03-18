const bcrypt = require("bcrypt");
const User = require("../models/User");
const { STATUS_CODE } = require("../Helper/enums");

const getAllUsers = async () => {
  try {
    const users = await User.find().select("-password").lean();
    return {
      code: STATUS_CODE.SUCCESS,
      success: true,
      data: users,
    };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const getUserById = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user)
      return {
        code: STATUS_CODE.BAD_REQUEST,
        success: false,
        message: "User not found",
      };
    return { code: STATUS_CODE.SUCCESS, success: true, data: user };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const createUser = async (userData) => {
  try {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return {
        success: false,
        code: STATUS_CODE.BAD_REQUEST,
        message: "Email already exists",
      };
    }

    const saltRounds = 10;
    userData.password = await bcrypt.hash(userData.password, saltRounds);

    const user = await User.create(userData);

    return { code: STATUS_CODE.SUCCESS, success: true, data: user };
  } catch (error) {
    return {
      success: false,
      code: STATUS_CODE.ERROR,
      message: error.message,
    };
  }
};

const updateUser = async (id, userData) => {
  try {
    if (userData.password) {
      const saltRounds = 10;
      userData.password = await bcrypt.hash(userData.password, saltRounds);
    }
    const user = await User.findByIdAndUpdate(id, userData, { new: true });
    if (!user)
      return {
        code: STATUS_CODE.BAD_REQUEST,
        success: false,
        message: "User not found",
      };
    return { code: STATUS_CODE.SUCCESS, success: true, data: user };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

const deleteUser = async (id) => {
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user)
      return {
        code: STATUS_CODE.BAD_REQUEST,
        success: false,
        message: "User not found",
      };
    return { code: STATUS_CODE.SUCCESS, success: true, data: user };
  } catch (error) {
    return { code: STATUS_CODE.ERROR, success: false, message: error.message };
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
