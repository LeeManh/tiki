const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter product name"],
      trim: true,
      unique: true,
    },
    desription: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    sales: {
      type: Number,
    },
    priceFinal: {
      type: Number,
    },
    ratings: {
      type: Number,
      default: 0,
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    category: {
      type: String,
      required: true,
    },
    seller: {
      type: String,
      required: true,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User", //ref to model name
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        ratings: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
        },
        time: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      //   required: true
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ name: "text" });

module.exports = mongoose.model("Product", productSchema);
