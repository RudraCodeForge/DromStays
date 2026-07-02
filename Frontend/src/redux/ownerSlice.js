import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  owner: null,
};

const ownerSlice = createSlice({
  name: "owner",
  initialState,
  reducers: {
    setOwnerFromBackend: (state, action) => {
      state.owner = action.payload;
    },

    clearOwner: (state) => {
      state.owner = null;
    },
  },
});

export const { setOwnerFromBackend, clearOwner } = ownerSlice.actions;
export default ownerSlice.reducer;
