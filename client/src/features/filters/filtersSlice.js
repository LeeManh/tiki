import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ratings: "",
  seller: "",
  price: "",
  page: 1,
  sort: "",
  category: "",
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    changeFilters: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearFilters: (state, action) => {
      state.ratings = "";
      state.seller = "";
      state.price = "";
      state.page = 1;
      state.sort = "";
      state.category = "";
    },
  },
});

export const { changeFilters, clearFilters } = filtersSlice.actions;

export const selectFilters = (state) => state.filters;

export default filtersSlice.reducer;
