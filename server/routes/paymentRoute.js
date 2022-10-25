const router = require("express").Router();
const paymentController = require("../controller/paymentController.js");
const verifyToken = require("../middleware/verifyToken.js");

router.route("/payment/process").post(verifyToken, paymentController.payment);

router
  .route("/stripeapikey")
  .get(verifyToken, paymentController.sendStripeApiKey);

module.exports = router;
