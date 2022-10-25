const router = require("express").Router();
const cartController = require("../controller/cartController.js");
const verifyToken = require("../middleware/verifyToken.js");

router.route("/addToCart").post(verifyToken, cartController.addToCart);

router
  .route("/cart/delete")
  .post(verifyToken, cartController.removeMutilItemsCart);

router
  .route("/cart/:id")
  .delete(verifyToken, cartController.removeItemCart)
  .put(verifyToken, cartController.updateCart);

router.route("/cart").get(verifyToken, cartController.getCartData);

module.exports = router;
