import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Addresses: [],
};

const addressSlice = createSlice({
  name: "Address",
  initialState,

  reducers: {
    addAddress: (state, action) => {
      state.Addresses.push({
        ...action.payload,
        quantity: 1,
      });
    },

    removeAddress: (state, action) => {
      state.items = state.Addresses.filter(
        (item) => item.addressId !== action.payload,
      );
    },
  },
});

export const { addAddress, removeAddress } = addressSlice.actions;

export default addressSlice.reducer;
