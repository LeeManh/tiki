const Order = require("../models/orderModel.js");
const ErrorHandler = require("../utils/ErrorHandler.js");
const catchAsyncError = require("../middleware/catchAsyncError.js");
const Features = require("../utils/Features.js");

//create order --user
const creteOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

//get single order --user
const getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  ); // filed user thi chen them field name va email tu User model

  if (!order) {
    return next(
      new ErrorHandler(`Not found order with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    order,
  });
});

//get all orders --user
const getAllOrders = catchAsyncError(async (req, res, next) => {
  const limit = req.query.limit * 1 || 5;

  const features = new Features(Order.find({ user: req.user._id }), req.query)
    .searching()
    .filtering()
    .sorting()
    .paginating(limit);

  const counting = new Features(Order.find({ user: req.user._id }), req.query)
    .searching()
    .filtering()
    .counting();

  const orders = await features.query;
  const count = await counting.query;

  res.status(200).json({
    success: true,
    count,
    limit,
    orders,
  });
});

//get all orders --admin
const getAminAllOrder = catchAsyncError(async (req, res, next) => {
  const limit = req.query.limit * 1 || 5;

  const features = new Features(Order.find(), req.query)
    .searching()
    .filtering()
    .sorting()
    .paginating(limit);

  const counting = new Features(Order.find(), req.query)
    .searching()
    .filtering()
    .counting();

  const orders = await features.query;
  const count = await counting.query;

  res.status(200).json({
    success: true,
    count,
    limit,
    orders,
  });
});

//update order status --admin
const updateAdminOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id); //id order

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }
  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }

  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save();
  // await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

//delete order --admin
const deleteAdminOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id); //id order

  if (!order) {
    return next(new ErrorHandler(`Not found order with id ${req.params.id}`));
  }

  res.status(200).json({
    success: true,
    message: "Delete order success",
  });
});

module.exports = {
  creteOrder,
  getSingleOrder,
  getAllOrders,
  getAminAllOrder,
  updateAdminOrder,
  deleteAdminOrder,
};
