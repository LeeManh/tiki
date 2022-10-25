const Favourite = require("../models/favouriteModel.js");
const catchAsyncError = require("../middleware/catchAsyncError.js");
const ErrorHandler = require("../utils/ErrorHandler.js");

const addItemToFavourite = catchAsyncError(async (req, res, next) => {
  const { name, price, sales, images, productId } = req.body;

  const favourite = await Favourite.create({
    name,
    price,
    sales,
    images,
    userId: req.user._id,
    productId,
  });

  res.status(201).json({
    success: true,
    favourite,
  });
});

const getFavouriteData = catchAsyncError(async (req, res, next) => {
  const favouriteData = await Favourite.find({ userId: req.user.id });

  res.status(200).json({
    success: true,
    favouriteData,
  });
});

const removeItemFavourite = catchAsyncError(async (req, res, next) => {
  const FavouriteData = await Favourite.findById(req.params.id);

  if (!FavouriteData) {
    return next(
      new ErrorHandler("FavouriteData is not found with this id", 404)
    );
  }

  await FavouriteData.remove();

  res.status(200).json({
    success: true,
    message: "Item removed from Favourite",
  });
});

module.exports = {
  addItemToFavourite,
  getFavouriteData,
  removeItemFavourite,
};
