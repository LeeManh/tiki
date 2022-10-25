import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { cartApi } from "../../api/cartApi";

const initialState = {
  items: [],
  status: "idle",
  error: null,
  selectedItems: [],
};

export const fetchCart = createAsyncThunk("cart/fetchCart", async (path) => {
  const response = await cartApi.getAllItemsCart();
  return response.data;
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state, action) => {
      state.items = [];
      state.selectedItems = [];
    },
    addItemToCart: (state, action) => {
      console.log("payload", action.payload);

      const {
        name,
        price,
        sales,
        quantity = 1,
        cartId,
        productId,
        images,
      } = action.payload;

      const item = {
        name,
        price,
        sales,
        quantity,
        cartId,
        productId,
        images,
      };

      console.log({ item });

      state.items.push(item);
    },
    removeItems: (state, action) => {
      const listIds = state.selectedItems.map((item) => item.productId);

      state.items = state.items.filter(
        (item) => !listIds.includes(item.productId)
      );
      state.selectedItems = state.selectedItems.filter(
        (item) => !listIds.includes(item.productId)
      );
    },
    removeSingleItem: (state, action) => {
      const { id } = action.payload;

      //remove from cart
      state.items = state.items.filter((item) => item.productId !== id);
      //remove from slected
      state.selectedItems = state.selectedItems.filter(
        (item) => item.productId !== id
      );
    },
    changeQuantity: (state, action) => {
      const { id, quantity } = action.payload;

      const foundItem = state.items.find((item) => item.productId === id);
      const foundItemCart = state.selectedItems.find(
        (item) => item.productId === id
      );

      if (foundItem) foundItem.quantity = quantity;
      if (foundItemCart) foundItemCart.quantity = quantity;
    },
    selectAllItemsToSelectedItems: (state, action) => {
      state.selectedItems = state.items;
    },
    removeAllItemsFromSelectedItems: (state, action) => {
      state.selectedItems = [];
    },
    selectItemToSelectedItems: (state, action) => {
      const { _id } = action.payload;

      const foundItem = state.items.find((item) => item.productId === _id);

      if (foundItem) {
        state.selectedItems.push(foundItem);
      }
    },
    removeItemFromSelectedItems: (state, action) => {
      const { _id } = action.payload;
      state.selectedItems = state.selectedItems.filter(
        (item) => item.productId !== _id
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        const { cartData } = action.payload;

        //cover _id -> cartId
        state.items = cartData.map(({ _id: cartId, ...rest }) => ({
          cartId,
          ...rest,
        }));
        state.status = "succeeded";
        state.error = null;
      });
  },
});

export const {
  addItemToCart,
  changeQuantity,
  selectAllItemsToSelectedItems,
  removeAllItemsFromSelectedItems,
  selectItemToSelectedItems,
  removeItemFromSelectedItems,
  removeAllItemsFromCart,
  removeItems,
  removeSingleItem,
  clearCart,
} = cartSlice.actions;

export const selectCartitems = (state) => state.cart.items;
export const selectSelectedItems = (state) => state.cart.selectedItems;

export default cartSlice.reducer;
