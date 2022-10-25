import { combineReducers } from "@reduxjs/toolkit";
import productsReducer from "../features/product/productsSlice";
import productDetailsReducer from "../features/product/productDetailsSlice";
import authReducer from "../features/auth/authSlice";
import filtersReducer from "../features/filters/filtersSlice";
import cartReducer from "../features/cart/cartSlice";
import favouriteReducer from "../features/favourite/favouriteSlice";
import paymentReducer from "../features/payment/paymentSlice";

const rootReducer = combineReducers({
  products: productsReducer,
  productDetails: productDetailsReducer,
  auth: authReducer,
  filters: filtersReducer,
  cart: cartReducer,
  favourite: favouriteReducer,
  payment: paymentReducer,
});

export default rootReducer;
