import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useDispatch, useSelector } from "react-redux";

import Home from "./pages/Home";
import DetailsProduct from "./features/product/DetailsProduct";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import RequireAuth from "./features/auth/RequireAuth ";
import EditProfile from "./features/user/EditProfile";
import UpdatePassword from "./features/user/UpdatePassword";
import Order from "./features/user/Order";
import SearchProduct from "./features/product/SearchProduct";
import CartPage from "./features/cart/CartPage";
import Payment from "./features/payment/Payment";
import { paymentApi } from "./api/paymentApi";
import PaymentSuccess from "./features/payment/PaymentSuccess";
import LoginRoutes from "./features/auth/LoginRoutes";
import DashBoard from "./features/admin/DashBoard";
import Products from "./features/admin/Product/Products";
import LayoutDashBoard from "./features/admin/LayoutDashBoard";
import CreateProduct from "./features/admin/Product/CreateProduct";
import EditProduct from "./features/admin/Product/EditProduct";
import Orders from "./features/admin/Orders/Orders";
import EditOrder from "./features/admin/Orders/EditOrder";
import Users from "./features/admin/Users/Users";
import EditUser from "./features/admin/Users/EditUser";
import Reviews from "./features/admin/Product/Reviews";
import ForgotPassword from "./features/auth/ForgotPassword";
import ResetPassword from "./features/auth/ResetPassword";
import Favourite from "./features/favourite/Favourite";
import LayoutProfile from "./features/user/LayoutProfile";
import EditPhone from "./features/user/EditPhone";
import EditEmail from "./features/user/EditEmail";
import { fetchCart } from "./features/cart/cartSlice";
import { selectUser } from "./features/auth/authSlice";
import { fetchFavourite } from "./features/favourite/favouriteSlice";

const App = () => {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);

  const [stripeapikey, setStripeapikey] = useState("");

  useEffect(() => {
    const getStripeApiKey = async () => {
      try {
        const res = await paymentApi.getStripeApiKey();
        setStripeapikey(res.data.stripeApiKey);
      } catch (error) {
        console.log(error);
      }
    };

    getStripeApiKey();
  }, []);

  useEffect(() => {
    dispatch(fetchCart());
    dispatch(fetchFavourite());
  }, [dispatch, user]);

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<DetailsProduct />} />
        <Route path="/search" element={<SearchProduct />} />

        <Route element={<LoginRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/password/reset" element={<ResetPassword />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={["user", "admin"]} />}>
          <Route path="me" element={<LayoutProfile />}>
            <Route path="edit">
              <Route index element={<EditProfile />} />
              <Route path="phone" element={<EditPhone />} />
              <Route path="email" element={<EditEmail />} />
              <Route path="password" element={<UpdatePassword />} />
            </Route>

            <Route path="orders" element={<Order />} />
            <Route path="favourite" element={<Favourite />} />
          </Route>

          <Route path="/cart" element={<CartPage />} />

          {stripeapikey && (
            <Route path="/payment">
              <Route
                index
                element={
                  <Elements stripe={loadStripe(stripeapikey)}>
                    <Payment />
                  </Elements>
                }
              />
              <Route path="success" element={<PaymentSuccess />} />
            </Route>
          )}
        </Route>

        <Route element={<RequireAuth allowedRoles={["admin"]} />}>
          <Route path="admin" element={<LayoutDashBoard />}>
            <Route path="dashboard" element={<DashBoard />} />

            <Route path="products">
              <Route index element={<Products />} />
              <Route path="new" element={<CreateProduct />} />
              <Route path="edit/:id" element={<EditProduct />} />
              <Route path="reviews/:id" element={<Reviews />} />
            </Route>

            <Route path="orders">
              <Route index element={<Orders />} />
              <Route path="edit/:id" element={<EditOrder />} />
            </Route>

            <Route path="users">
              <Route index element={<Users />} />
              <Route path="edit/:id" element={<EditUser />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
