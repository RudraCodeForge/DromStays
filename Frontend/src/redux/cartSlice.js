import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    addToCart: (state, action) => {
      const alreadyExists = state.items.some(
        (item) => item.serviceId === action.payload.serviceId,
      );

      if (!alreadyExists) {
        state.items.push({
          ...action.payload,
          quantity: 1,
        });
      }
    },

    increaseQuantity: (state, action) => {
      const item = state.items.find(
        (item) => item.serviceId === action.payload,
      );

      if (item) {
        item.quantity += 1;
      }
    },

    decreaseQuantity: (state, action) => {
      const item = state.items.find(
        (item) => item.serviceId === action.payload,
      );

      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => item.serviceId !== action.payload,
      );
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
