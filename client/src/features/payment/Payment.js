import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import MetaData from "../../components/Layout/MetaData";
import MobileStepper from "@mui/material/MobileStepper";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { clearCart, removeItems, selectSelectedItems } from "../cart/cartSlice";
import numberWithCommas from "../../utils/numberWithCommas";
import Divider from "@mui/material/Divider";
import Navbar from "../../components/Layout/Navbar";
import {
  createOrder,
  selectErrorOrder,
  selectPriceInfor,
  selectStatusOrder,
} from "./paymentSlice";
import { paymentApi } from "../../api/paymentApi";
import { cartApi } from "../../api/cartApi";

const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();

  const selectedItems = useSelector(selectSelectedItems);
  console.log({ selectedItems });
  const listIds = selectedItems.map((item) => item.cartId);

  const priceInfor = useSelector(selectPriceInfor);
  const statusOrder = useSelector(selectStatusOrder);
  const errorOrder = useSelector(selectErrorOrder);

  const [activeStep, setActiveStep] = useState(0);
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: "",
    address: "",
    method: "",
  });

  const isCanSubmit = Object.values(shippingInfo).every((val) => Boolean(val));

  const handleChangeForm = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!isCanSubmit) {
      return;
    }

    const toastId = toast.loading("Loading...");

    try {
      const res = await paymentApi.payment({ amount: priceInfor.total });

      const client_secret = res.data.client_secret;

      if (!stripe || !elements) return;

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: shippingInfo.name,
            phone: shippingInfo.phone,
            address: { line1: shippingInfo.address },
          },
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      }

      if (result.paymentIntent.status === "succeeded") {
        const order = {
          shippingInfo: shippingInfo,
          orderItems: selectedItems,
          discount: priceInfor.discount,
          itemsPrice: priceInfor.itemsPrice,
          totalPrice: priceInfor.total,
        };
        order.paymentInfo = {
          id: result.paymentIntent.id,
          status: result.paymentIntent.status,
        };
        console.log({ order });
        dispatch(createOrder(order)); //call api create order

        // remove item form cart
        await cartApi.deleteMutilItemsCart(listIds);
        dispatch(removeItems());

        navigate("success");
      }
    } catch (error) {
      toast(errorOrder);
    } finally {
      toast.dismiss(toastId);
    }
  };

  const steps = [
    {
      label: "Xác nhận sản phẩm",
      description: (
        <div>
          {selectedItems.map((item) => (
            <div className="flex gap-4 items-center py-2" key={item._id}>
              <img
                src={item.images[0].url}
                alt={item.name}
                className="w-[80px] h-[80px] object-cover rounded flex-shrink-0 border"
              />

              <div className="space-y-2 ">
                <p className="text-base">{item.name}</p>
                <div className="flex items-center space-x-4">
                  <p className="text-pink font-semibold text-lg">
                    {numberWithCommas(
                      item.price - (item.sales / 100) * item.price || 0
                    )}
                    đ
                  </p>
                  {item.sales !== 0 && (
                    <>
                      <p className="text-sm text-secondary line-through font-semibold">
                        {numberWithCommas(item.price)} đ
                      </p>
                      <span className="text-pink p-[2px] border border-pink text-sm leading-none font-semibold">
                        -{item.sales}%
                      </span>
                    </>
                  )}
                </div>

                <div className="space-x-2 text-sm">
                  <span>Số lượng :</span>
                  <span> {item.quantity}</span>
                </div>
              </div>
            </div>
          ))}

          <Divider className="!my-4" />

          <div className="container-cus wrapper bg-white py-4 rounded mt-2 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-base text-secondary">Tạm tính</span>
              <span className="text-base font-semibold">
                {numberWithCommas(priceInfor.itemsPrice) || 0} ₫
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base text-secondary">Giảm giá</span>
              <span className="text-base text-pink font-semibold">
                - {numberWithCommas(priceInfor.discount)} đ
              </span>
            </div>
            <Divider className="!my-4" />
            <div className="flex items-center justify-between">
              <div>
                <span className="text-base block">Tổng tiền</span>
                <span className="font-semibold text-xl text-pink">
                  {numberWithCommas(priceInfor.total)} ₫
                </span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      label: "Địa chỉ giao hàng",
      description: (
        <div>
          <form className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Tên người nhận"
              className="border outline-none rounded px-2 py-2"
              value={shippingInfo.name}
              onChange={handleChangeForm}
            />
            <input
              type="text"
              name="phone"
              placeholder="Số điện thoại"
              className="border outline-none rounded px-2 py-2"
              value={shippingInfo.phone}
              onChange={handleChangeForm}
            />
            <input
              type="text"
              name="address"
              placeholder="Địa chỉ nhận hàng"
              className="border outline-none rounded px-2 py-2"
              value={shippingInfo.address}
              onChange={handleChangeForm}
            />
          </form>
        </div>
      ),
    },
    {
      label: "Phương thức thanh toán",
      description: (
        <div>
          <form className="space-y-4">
            <label className="flex items-center gap-x-4">
              <input
                type="radio"
                name="method"
                value="atm"
                checked={shippingInfo.method === "atm"}
                onChange={handleChangeForm}
              />
              <div className="flex items-center gap-x-2">
                <img
                  src="https://frontend.tikicdn.com/_mobile-next/static/img/icons/checkout/icon-payment-method-atm.svg"
                  alt=""
                  className="w-[32px] h-[32px] object-cover"
                />
                <span className="text-text font-medium">Thẻ ATM</span>
              </div>
            </label>
          </form>
          {shippingInfo.method === "atm" && (
            <form className="space-y-4 mt-4">
              <div>
                <CardNumberElement className="w-full px-2 py-3 border rounded" />
              </div>
              <div>
                <CardExpiryElement className="w-full px-2 py-3 border rounded" />
              </div>
              <div>
                <CardCvcElement className="w-full px-2 py-3 border rounded" />
              </div>

              <button
                className={`btn btn--pink mt-8 disabled:cursor-default ${
                  !isCanSubmit && "bg-gray-400"
                }`}
                disabled={!isCanSubmit}
                onClick={handlePayment}
              >
                Thanh toán
              </button>
            </form>
          )}
        </div>
      ),
    },
  ];

  const maxSteps = steps.length;

  return (
    <>
      <MetaData title="Thanh toán" />
      <Navbar />

      <div className="container-cus wrapper bg-white py-4 rounded mt-4">
        <h1 className="font-semibold text-base">{steps[activeStep].label}</h1>
      </div>

      <div className="container-cus wrapper mt-4 flex gap-4 flex-col md:flex-row">
        <div className="min-h-[400px] grow bg-white shadow rounded px-4 py-4">
          {steps[activeStep].description}
        </div>
        <div className="w-full md:w-[300px] bg-white shadow rounded px-4">
          <MobileStepper
            variant="text"
            steps={maxSteps}
            position="static"
            activeStep={activeStep}
            nextButton={
              <Button
                size="small"
                onClick={handleNext}
                disabled={activeStep === maxSteps - 1}
              >
                Next <KeyboardArrowRight />
              </Button>
            }
            backButton={
              <Button
                size="small"
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                <KeyboardArrowLeft />
                Back
              </Button>
            }
          />
        </div>
      </div>
    </>
  );
};

export default Payment;
