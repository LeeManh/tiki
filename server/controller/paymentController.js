const catchAsyncError = require("../middleware/catchAsyncError.js");
const dotenv = require("dotenv");

if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({
    path: "server/.env",
  });
}

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const payment = catchAsyncError(async (req, res, next) => {
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "vnd",
  });

  res
    .status(200)
    .json({ success: true, client_secret: myPayment.client_secret });
});

const sendStripeApiKey = catchAsyncError(async (req, res, next) => {
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
});

module.exports = {
  payment,
  sendStripeApiKey,
};
