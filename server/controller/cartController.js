const Cart = require("../models/cartModel.js");
const catchAsyncError = require("../middleware/catchAsyncError.js");
const ErrorHandler = require("../utils/ErrorHandler.js");

const addToCart = catchAsyncError(async (req, res, next) => {
  const { name, price, sales, images, quantity, productId } = req.body;

  const cart = await Cart.create({
    name,
    price,
    sales,
    images,
    quantity,
    userId: req.user._id,
    productId,
  });

  res.status(201).json({
    success: true,
    cart,
  });
});

const getCartData = catchAsyncError(async (req, res, next) => {
  const cartData = await Cart.find({ userId: req.user.id });

  res.status(200).json({
    success: true,
    cartData,
  });
});

const removeItemCart = catchAsyncError(async (req, res, next) => {
  const cartData = await Cart.findById(req.params.id);

  if (!cartData) {
    return next(new ErrorHandler("Items is not found with this id", 404));
  }

  await cartData.remove();

  res.status(200).json({
    success: true,
    message: "Item removed from cart",
  });
});

const removeMutilItemsCart = catchAsyncError(async (req, res, next) => {
  await Cart.deleteMany({ _id: { $in: [...req.body.ids] } });

  res.status(200).json({
    success: true,
  });
});

const updateCart = catchAsyncError(async (req, res, next) => {
  const { quantity } = req.body;

  const cart = await Cart.findByIdAndUpdate(
    req.params.id,
    { $set: { quantity } },
    {
      new: true,
    }
  );

  if (!cart) {
    return next(new ErrorHandler("No cart found with this id", 404));
  }

  res.status(200).json({
    success: true,
    cart,
  });
});

module.exports = {
  addToCart,
  getCartData,
  removeItemCart,
  updateCart,
  removeMutilItemsCart,
};
