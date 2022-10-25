const ErrorHandler = require("../utils/ErrorHandler.js");
const catchAsyncError = require("./catchAsyncError.js");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

const verifyToken = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Please login", 401));
  }

  const decodeData = jwt.decode(token, process.env.JWT_SECRET_KEY);

  req.user = await User.findById(decodeData.id);

  next();
});

module.exports = verifyToken;
