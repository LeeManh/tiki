import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { paymentApi } from "../../api/paymentApi";

const initialState = {
  priceInfor: {
    discount: 0,
    itemsPrice: 0,
    total: 0,
  },
  order: null,
  status: "idle",
  error: null,
};

export const createOrder = createAsyncThunk(
  "payment/createOrder",
  async (order, { rejectWithValue }) => {
    try {
      const response = await paymentApi.createOrder(order);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    changePriceInfor: (state, action) => {
      const { discount, itemsPrice, total } = action.payload;

      state.priceInfor.discount = discount;
      state.priceInfor.itemsPrice = itemsPrice;
      state.priceInfor.total = total;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.order = action.payload;
      });
  },
});

export const { changePriceInfor } = paymentSlice.actions;

export const selectPriceInfor = (state) => state.payment.priceInfor;
export const selectStatusOrder = (state) => state.payment.status;
export const selectErrorOrder = (state) => state.payment.error;

export default paymentSlice.reducer;
