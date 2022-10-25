const User = require("../models/userModel.js");
const ErrorHandler = require("../utils/ErrorHandler.js");
const catchAsyncError = require("../middleware/catchAsyncError.js");
const sendToken = require("../utils/jwtToken.js");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto");
const Features = require("../utils/Features.js");
const cloudinary = require("cloudinary").v2;

const creatUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
  });

  sendToken(user, 201, res);
});

const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Missing email or password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Wrong email or password", 401));
  }

  //compare password
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Wrong email or password", 401));
  }

  sendToken(user, 200, res);
});

const logoutUser = catchAsyncError(async (req, res) => {
  res.cookie("token", "", {
    exprires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logout success",
  });
});

const forgotPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  // Only for user have registerd
  if (!user) {
    return next(new ErrorHandler("Not found email", 404));
  }
  //get resetToken
  const resetToken = user.getResetToken();

  await user.save({
    validateBeforeSave: false,
  });

  // const resetPasswordUrl = `${req.protocol}://${req.get(
  //   "host"
  // )}/password/reset/${resetToken}`;

  const message = `Your password reset token is : \n\n ${resetToken}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Token Reset Password Ecommerce",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Send Token reset password to ${user.email} success`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTime = undefined;

    await user.save({
      validateBeforeSave: false,
    });

    return next(new ErrorHandler(error.message));
  }
});

const resetPassword = catchAsyncError(async (req, res, next) => {
  //crete token hash
  resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordTime: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Invalid or exprired time reset token", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("Password not match with confirmpassword", 400)
    );
  }

  //save user
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordTime = undefined;
  await user.save();

  sendToken(user, 200, res);
});

const getDetailsUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

const updatePasswordUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("Confirm password not match with new password", 400)
    );
  }

  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res);
});

const updateProfileUser = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
  };

  let user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorHandler(`Not found user with id ${req.user.id}`, 404));
  }

  if (req.body.avatar && user.avatar.url !== req.body.avatar) {
    if (user.avatar?.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    await cloudinary.uploader
      .upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      })
      .then((result) => {
        newUserData.avatar = {
          public_id: result.public_id,
          url: result.secure_url,
        };
      });
  }

  user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// admin
const getAllUsers = catchAsyncError(async (req, res, next) => {
  const limit = req.query.limit * 1 || 5;

  const features = new Features(User.find(), req.query)
    .searching()
    .filtering()
    .sorting()
    .paginating(limit);

  const counting = new Features(User.find(), req.query)
    .searching()
    .filtering()
    .counting();

  const users = await features.query;
  const count = await counting.query;

  res.status(200).json({
    success: true,
    count,
    limit,
    users,
  });
});

const getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User not found with id ${req.params.id}`, 400)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

const changeUserRole = catchAsyncError(async (req, res, next) => {
  const { roles } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { roles },
    { new: true }
  );

  if (!user) {
    return next(
      new ErrorHandler(`Not found user with id ${req.params.id}`, 400)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

//delete user --admin
const deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`Not found user with id ${req.params.id}`, 400)
    );
  }

  if (user.avatar?.public_id) {
    await cloudinary.uploader.destroy(user.avatar.public_id);
  }

  await user.remove();

  res.status(200).json({
    success: true,
    message: "Delete user successly",
  });
});

// getUsersStats --admin
const getUsersStats = catchAsyncError(async (req, res, next) => {
  const data = await User.aggregate([
    {
      $project: {
        month: { $month: "$createdAt" },
      },
    },
    {
      $group: {
        _id: "$month",
        total: { $sum: 1 },
      },
    },
  ]);
  res.status(200).json(data);
});

module.exports = {
  creatUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getDetailsUser,
  updatePasswordUser,
  updateProfileUser,
  getAllUsers,
  getSingleUser,
  changeUserRole,
  deleteUser,
  getUsersStats,
};
