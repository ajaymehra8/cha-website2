const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Provide all required credentials.",
    });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Please provide correct email",
    });
  }
  if (user && (await user.matchPassword(password))) {
    const token = await generateToken(user._id);
    return res.status(200).json({
      success: false,
      message: "Logged in successfully.",
      _id:user._id,
      jwt: token,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
    });
  } else {
    return res.status(400).json({
      success: false,
      message: "Please provide correct password",
    });
  }
});
exports.signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const fields = { name, email, password };
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Provide all required credentials.",
    });
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    return res.status(400).json({
      success: false,
      message: "User already exists, Please login.",
    });
  }
  if (req.file) {
    fields.pic = req.file.filename;
  }
  const user = await User.create(fields);
  const token = await generateToken(user._id);
  res.status(200).json({
    success: true,
    message: "Your account is created, Please login!",
    _id:user._id,
    jwt: token,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    pic: user.pic,
  });
});
exports.getAllUser = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find(keyword)
    .find({ _id: { $ne: req.user._id } })
    .select("-password -createdAt -updatedAt -__v");
  res.status(200).json({
    success: true,
    users,
  });
});

// Delete this route in production
exports.deleteAllUser = asyncHandler(async (req, res) => {
  const result = await User.deleteMany({});
  res.send("Deleted successfully");
});
