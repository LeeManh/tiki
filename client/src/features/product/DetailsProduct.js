import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "../../components/Layout/MetaData";
import Navbar from "../../components/Layout/Navbar";
import {
  fetchDetailsProduct,
  selectErrorProductDetails,
  selectProductDetails,
  selectStatusProductDetails,
} from "./productDetailsSlice";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Rating from "@mui/material/Rating";
import numberWithCommas from "../../utils/numberWithCommas";
import { addItemToCart, selectCartitems } from "../cart/cartSlice";
import toast from "react-hot-toast";
import {
  addItemTofavourite,
  selectItemsfavourite,
} from "../favourite/favouriteSlice";
import ReviewsProducts from "./ReviewsProducts";
import LinearProgress from "@mui/material/LinearProgress";
import ThumbsGallery from "./ThumbsGallery";
import { cartApi } from "../../api/cartApi";
import { favouriteApi } from "../../api/favouriteApi";
import Footer from "../../components/Layout/Footer";
import { selectIsAuthenticated } from "../auth/authSlice";

const DetailsProduct = () => {
  const dispatch = useDispatch();

  const { id } = useParams();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const productDetails = useSelector(selectProductDetails);
  const status = useSelector(selectStatusProductDetails);
  const error = useSelector(selectErrorProductDetails);
  const cartItems = useSelector(selectCartitems);
  const favouriteItems = useSelector(selectItemsfavourite);

  const price = useMemo(() => {
    return productDetails.sales
      ? productDetails.price -
          (productDetails.sales / 100) * productDetails.price
      : productDetails.price;
  }, [productDetails?.price, productDetails?.sales]);

  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      toast.error("Xin hãy đăng nhập");
    }
    const foundItem = cartItems.some((item) => item.productId === productId);

    if (foundItem) {
      toast.error("Sản phẩm đã có trong giỏ hàng 🙄");
      return;
    }

    try {
      const res = await cartApi.addItemCart({
        product: { ...productDetails, productId },
        quantity,
      });

      dispatch(
        addItemToCart({
          ...productDetails,
          productId,
          quantity: Number(quantity),
          cartId: res.data.cart._id,
        })
      );
      toast.success("Thêm vào giỏ hàng thành công 🎉");
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToFavourite = async (productId) => {
    if (!isAuthenticated) {
      toast.error("Xin hãy đăng nhập");
    }

    const foundItem = favouriteItems.some(
      (item) => item.productId === productId
    );

    if (foundItem) {
      toast.error("Sản phẩm đã có trong yêu thích 🙄");
      return;
    }

    try {
      const res = await favouriteApi.addItemToFavourite({
        product: { ...productDetails, productId },
      });

      dispatch(
        addItemTofavourite({
          ...productDetails,
          favouriteId: res.data.favourite._id,
        })
      );
      toast.success("Thêm vào yêu thích thành công 🎉");
    } catch (error) {
      console.log(error);
    }
  };

  //fetch details product
  useEffect(() => {
    dispatch(fetchDetailsProduct(id));
  }, [id, dispatch]);

  //check loading
  if (status === "loading" || status === "idle") {
    return (
      <>
        <Navbar />
        <LinearProgress />
      </>
    );
  } else if (status === "failed") {
    return <div>{error}</div>;
  }

  return (
    <>
      <MetaData title={`Details | ${productDetails.name}`} />
      <Navbar />

      {/* Content */}
      <div className="container-cus wrapper space-y-4 mb-4">
        {/* details */}
        <div className="flex flex-wrap bg-white mt-4 shadow rounded py-4">
          <div className="w-full md:w-1/2 ">
            <ThumbsGallery images={productDetails.images} />
          </div>

          <div className="w-full md:w-1/2 mt-4 md:mt-0 p-4 space-y-3">
            <p className="text-lg font-semibold first-letter:uppercase">
              {productDetails.name}
            </p>

            <div className="flex items-center space-x-2">
              <Rating
                name="simple-controlled"
                value={productDetails.ratings}
                readOnly
              />
              <span className="text-sm">
                ( {productDetails.numOfReviews} reviews )
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <p className="text-pink font-bold text-2xl">
                ${numberWithCommas(price)} đ
              </p>
              {productDetails.sales !== 0 && (
                <>
                  <p className="text-sm text-secondary line-through font-semibold">
                    {numberWithCommas(productDetails.price)} đ
                  </p>
                  <span className="text-pink p-[2px] border border-pink text-sm leading-none font-semibold">
                    -{productDetails.sales}%
                  </span>
                </>
              )}
            </div>

            <div>
              <label>
                <span className="mr-2">Số lượng: </span>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  max={99}
                  min={1}
                  className="border rounded border-slate-500 px-2 py-1"
                />
              </label>
            </div>

            <div>
              <p className="font-semibold first-letter:uppercase">Mô tả : </p>
              <p>{productDetails.desription}</p>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <div
                className="flex items-center space-x-2 btn btn--border"
                onClick={() => handleAddToFavourite(productDetails._id)}
              >
                <FavoriteBorderIcon />
                <span>Thêm vào yêu thích</span>
              </div>
              <div
                className="flex items-center space-x-2 btn btn--pink"
                onClick={() => handleAddToCart(productDetails._id)}
              >
                <ShoppingCartIcon />
                <span>Thêm vào giỏ hàng</span>
              </div>
            </div>
          </div>
        </div>

        {/* review */}
        <div className="bg-white mt-4 shadow rounded">
          <ReviewsProducts productDetails={productDetails} />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default DetailsProduct;
