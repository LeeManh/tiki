const ErrorHandler = require("../utils/ErrorHandler.js");
const catchAsyncError = require("./catchAsyncError.js");
const User = require("../models/userModel.js");

const verifyRoles = (allowedRoles) => (req, res, next) => {
  // if (!roles.includes(req.user.role)) {
  //   return next(new ErrorHandler("You don't have permission", 403));
  // }

  if (!req.user.roles.some((role) => allowedRoles.includes(role))) {
    return next(new ErrorHandler("You don't have permission", 403));
  }

  next();
};

module.exports = verifyRoles;
