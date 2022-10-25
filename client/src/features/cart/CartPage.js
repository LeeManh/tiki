import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import MetaData from "../../components/Layout/MetaData";
import Navbar from "../../components/Layout/Navbar";
import {
  removeAllItemsFromSelectedItems,
  removeItems,
  selectAllItemsToSelectedItems,
  selectCartitems,
  selectSelectedItems,
} from "./cartSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import Divider from "@mui/material/Divider";
import CartItem from "./CartItem";
import StepProgressBar from "./StepProgressBar";
import numberWithCommas from "../../utils/numberWithCommas";
import { changePriceInfor } from "../payment/paymentSlice";
import { cartApi } from "../../api/cartApi";
import Footer from "../../components/Layout/Footer";

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector(selectCartitems);

  const selectedItems = useSelector(selectSelectedItems);
  const listIds = selectedItems.map((item) => item.cartId);

  const isSelectedAll = selectedItems.length === cartItems.length;
  const isDisableCheckOutBtn = Boolean(!selectedItems.length);

  const itemsPrice = selectedItems.reduce(
    (total, item) =>
      total +
      item.price * item.quantity -
      (item.price * (item.sales / 100) || 0),
    0
  );
  const discount =
    itemsPrice >= 299000 ? 30000 : itemsPrice >= 149000 ? 10000 : 0;
  const total = itemsPrice - discount;

  const percent =
    itemsPrice >= 299000
      ? 100
      : itemsPrice >= 149000
      ? 50 + ((itemsPrice - 149000) / 150000) * 100 * 0.5
      : (itemsPrice / 299000) * 100;

  const handleCheckAll = () => {
    if (isSelectedAll) {
      dispatch(removeAllItemsFromSelectedItems());
    } else {
      dispatch(selectAllItemsToSelectedItems());
    }
  };

  const handleDeteleSelectedItems = async () => {
    if (listIds.length === 0) return;

    try {
      await cartApi.deleteMutilItemsCart(listIds);
      dispatch(removeItems());
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickBuy = () => {
    if (!selectedItems.length) return;

    dispatch(changePriceInfor({ discount, itemsPrice, total }));

    navigate("/payment");
  };

  let content;

  if (cartItems.length === 0) {
    content = (
      <div className="flex flex-col items-center justify-center space-y-4 py-8 ">
        <img
          src="https://salt.tikicdn.com/ts/upload/00/54/86/76f242bcae9ba53612498da014b7c3b9.png"
          alt=""
          className="max-w-[100%] w-[300px] aspect-video object-contain"
        />
        <span>Bạn chưa có sản phẩm nào trong giỏ hàng</span>
        <button className="btn btn--pink " onClick={() => navigate("/")}>
          Tiếp tục mua sắm
        </button>
      </div>
    );
  } else {
    content = (
      // container-cus wrapper flex
      <div className=" flex align-top gap-x-8 gap-y-4 mt-4 flex-col md:flex-row">
        <div className="bg-white py-4 rounded grow">
          {/* header */}
          <div className="flex justify-between items-center ">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isSelectedAll}
                onChange={handleCheckAll}
              ></input>
              <span className="text-base text-text">
                Tất cả ({selectedItems.length} sản phẩm)
              </span>
            </label>
            <DeleteIcon
              className="text-secondary cursor-pointer"
              onClick={handleDeteleSelectedItems}
            />
          </div>

          <Divider className="!my-4" />

          <div className="!my-6">
            <StepProgressBar percent={percent} />
          </div>

          <div className="flex flex-col gap-4 divide-y">
            {cartItems.map((item) => (
              <CartItem item={item} key={item._id} />
            ))}
          </div>
        </div>

        {/* Infor price */}
        <div className="bg-white py-4 rounded space-y-4 md:w-[300px]">
          <div className="flex items-center justify-between">
            <span className="text-base text-secondary">Tạm tính</span>
            <span className="text-base font-semibold">
              {numberWithCommas(itemsPrice) || 0} ₫
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-base text-secondary">Giảm giá</span>
            <span className="text-base text-pink font-semibold">
              - {numberWithCommas(discount)} đ
            </span>
          </div>
          <Divider className="!my-4" />
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="text-base block">Tổng tiền</span>
              <span className="font-semibold text-xl text-pink">
                {numberWithCommas(total)} ₫
              </span>
            </div>
            <button
              className={`btn text-white disabled:cursor-default md:w-full ${
                isDisableCheckOutBtn ? "bg-gray-400" : "btn--pink"
              }`}
              disabled={isDisableCheckOutBtn}
              onClick={handleClickBuy}
            >
              Mua hàng ({selectedItems.length})
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaData title="Home" />
      <Navbar />
      <div className="mb-6 container-cus wrapper mt-4">
        <div className="px-4 bg-white shadow rounded min-h-[400px]">
          {content}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
