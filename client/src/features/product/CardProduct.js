import React from "react";
import { Link } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import Divider from "@mui/material/Divider";
import numberWithCommas from "../../utils/numberWithCommas";

const CardProduct = ({ product }) => {
  const price =
    product.sales !== 0
      ? product.price - (product.price * product.sales) / 100
      : product.price;

  return (
    <Link to={`/product/${product._id}`}>
      <div className="w-full border rounded-sm shadow cursor-pointer bg-white sm:max-w-none h-full">
        <div className="w-full aspect-square">
          <img
            src={product.images[0]?.url}
            alt=""
            className="w-full object-cover h-full"
          />
        </div>

        <div className="p-2 pb-3 text-sm space-y-2">
          <h3 className="text-sm text-[#38383d] line-clamp-3 first-letter:uppercase">
            {product.name}
          </h3>

          <div className="flex items-center space-x-2 text-[#808089]">
            <div className="flex items-center space-x-1">
              <span> {product.ratings}</span>
              <StarIcon className="text-yellow-400 !w-4 !h-4" />
            </div>
            <Divider orientation="vertical" flexItem />
            <p className="text-xs">{product.numOfReviews} Đánh giá </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[#ff424e] text-base font-semibold">
              {numberWithCommas(price)} đ
            </span>
            {product.sales !== 0 && (
              <span className="text-xs font-semibold text-[#ff424e]">
                -{product.sales}%
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CardProduct;
