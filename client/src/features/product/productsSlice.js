import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productApi } from "../../api/productApi";

const initialState = {
  status: "idle", // idle || succeeded || failed || loading
  error: null,
  products: [],
  totalProducts: 0,
  productsPerPage: 0,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (path) => {
    const response = await productApi.getAllProducts(path);

    return response.data;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    createReview: (state, action) => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        const { products, count, limit } = action.payload;

        state.products = products;
        state.totalProducts = count;
        state.productsPerPage = limit;
        state.status = "succeeded";
        state.error = null;
      });
  },
});

export default productSlice.reducer;

export const { createReview } = productSlice.actions;

export const selectStatusProducts = (state) => state.products.status;
export const selectProducts = (state) => state.products.products;
export const selectErrorProducts = (state) => state.products.error;
export const selectTotalProducts = (state) => state.products.totalProducts;
export const selectProductsPerPage = (state) => state.products.productsPerPage;
