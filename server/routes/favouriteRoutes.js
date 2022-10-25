const router = require("express").Router();
const favouriteController = require("../controller/favouriteController.js");
const verifyToken = require("../middleware/verifyToken.js");

router
  .route("/addToFavourite")
  .post(verifyToken, favouriteController.addItemToFavourite);

router
  .route("/favourite")
  .get(verifyToken, favouriteController.getFavouriteData);

router
  .route("/favourite/:id")
  .delete(verifyToken, favouriteController.removeItemFavourite);

module.exports = router;
