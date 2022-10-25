const Product = require("../models/productModel.js");
const ErrorHandler = require("../utils/ErrorHandler.js");
const catchAsyncError = require("../middleware/catchAsyncError.js");
const Features = require("../utils/Features.js");
const cloudinary = require("cloudinary").v2;

const getDetailsProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorHandler(`Not found product with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    product,
  });
});

const getAllProducts = catchAsyncError(async (req, res) => {
  const limit = req.query.limit * 1 || 10;

  const features = new Features(Product.find(), req.query)
    .searching()
    .filtering()
    .sorting()
    .paginating(limit);

  const counting = new Features(Product.find(), req.query)
    .searching()
    .filtering()
    .counting();

  const products = await features.query;
  const count = await counting.query;

  res.status(200).json({
    success: true,
    count,
    limit,
    products,
  });
});

// create product --admin
const creatProduct = catchAsyncError(async (req, res) => {
  let images = [];
  const imagesLinks = [];

  //check req.body.images is string or array
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

  const priceFinal =
    req.body.sales !== 0
      ? req.body.price - (req.body.sales / 100) * req.body.price
      : req.body.price;

  const product = await Product.create({ ...req.body, priceFinal });

  res.status(201).json({
    success: true,
    product,
  });
});

// update product --admin
const updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  let images = [];
  const imagesLinks = [];

  if (!product) {
    return next(
      new ErrorHandler(`Not found product with id ${req.params.id}`, 404)
    );
  }

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Delete image from cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks = [];
    //upload to cloundiany
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.uploader.upload(images[i], {
        folder: "products",
      });
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
    req.body.images = imagesLinks;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useUnified: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// delete product --admin
const deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorHandler(`Not found product with id ${req.params.id}`, 404)
    );
  }

  //delete images from cloundianry
  product.images.forEach(
    async (image) => await cloudinary.uploader.destroy(image.public_id)
  );

  //delete form moongodb
  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product deleted success!",
  });
});

const createProductReview = catchAsyncError(async (req, res, next) => {
  const { ratings, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    ratings: Number(ratings),
    comment,
  };

  const product = await Product.findById(productId);

  if (!product) {
    return next(
      new ErrorHandler(`Not found product with id ${productId}`, 400)
    );
  }

  //kiem tra xem product da duoc review boi nguoi dung nay hay chua
  const isReviewed = product.reviews.some(
    (rev) => rev.user.toString() === review.user.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === review.user.toString()) {
        rev.ratings = ratings;
        rev.name = req.user.name;
        rev.comment = comment;
        rev.time = Date.now();
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  //caculator ratings
  const avg = product.reviews.reduce((sum, rev) => {
    return sum + rev.ratings;
  }, 0);
  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Create review success",
  });
});

// Get All reviews of a single product -- Public
const getAllReviewOfSingleProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(
      new ErrorHandler(`Not found product with id ${req.query.productId}`, 400)
    );
  }
  const limit = req.query.limit * 1 || 5;

  res.status(200).json({
    success: true,
    count: product?.reviews?.length,
    limit,
    reviews: product?.reviews,
  });
});

// Delete Review of Product --Admin
const deleteSingleReview = catchAsyncError(async (req, res, next) => {
  const { idReview, productId } = req.query;

  const product = await Product.findById(productId);

  if (!product) {
    return next(
      new ErrorHandler(`Not found product with id ${productId}`, 400)
    );
  }

  //loai bo  review
  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== idReview.toString()
  );

  //caculator ratings
  let ratings = 0;
  if (reviews.length === 0) {
    ratings = 0;
  } else {
    const avg = reviews.reduce((sum, rev) => sum + rev.ratings, 0);
    ratings = avg / reviews.length;
  }

  //caculator new numOfReviews
  const numOfReviews = reviews.length;

  // udapte
  await Product.findByIdAndUpdate(
    productId,
    { reviews, ratings, numOfReviews },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Delete review success",
  });
});

module.exports = {
  getAllProducts,
  creatProduct,
  updateProduct,
  deleteProduct,
  getDetailsProduct,
  createProductReview,
  getAllReviewOfSingleProduct,
  deleteSingleReview,
};
