import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { favouriteApi } from "../../api/favouriteApi";

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchFavourite = createAsyncThunk(
  "favourite/fetchFavourite",
  async (path) => {
    const response = await favouriteApi.getAllItemsFavourite();
    return response.data;
  }
);

const favouriteSlice = createSlice({
  name: "favourite",
  initialState,
  reducers: {
    addItemTofavourite: (state, action) => {
      const {
        name,
        price,
        sales,
        _id: productId,
        images,
        favouriteId,
      } = action.payload;
      const item = {
        name,
        price,
        sales,
        quantity: 1,
        productId,
        images,
        favouriteId,
      };

      state.items.push(item);
    },
    removeItemFavourite: (state, action) => {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload.id
      );
    },
    clearFavourite: (state, action) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavourite.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFavourite.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchFavourite.fulfilled, (state, action) => {
        const { favouriteData } = action.payload;

        //cover _id -> favouriteId
        state.items = favouriteData.map(({ _id: favouriteId, ...rest }) => ({
          favouriteId,
          ...rest,
        }));
        state.status = "succeeded";
        state.error = null;
      });
  },
});

export const { addItemTofavourite, removeItemFavourite, clearFavourite } =
  favouriteSlice.actions;

export const selectItemsfavourite = (state) => state.favourite.items;

export default favouriteSlice.reducer;
