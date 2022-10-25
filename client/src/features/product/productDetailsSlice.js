import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productApi } from "../../api/productApi";

const initialState = {
  status: "idle", // idle || succeeded || failed || loading
  error: null,
  product: {},
};

export const fetchDetailsProduct = createAsyncThunk(
  "productDetails/fetchDetailsProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await productApi.getDetailsProduct(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const productDetailsSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDetailsProduct.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchDetailsProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchDetailsProduct.fulfilled, (state, action) => {
        const { product } = action.payload;

        state.product = product;
        state.status = "succeeded";
      });
  },
});

export default productDetailsSlice.reducer;

export const selectStatusProductDetails = (state) =>
  state.productDetails.status;
export const selectProductDetails = (state) => state.productDetails.product;
export const selectErrorProductDetails = (state) => state.productDetails.error;
