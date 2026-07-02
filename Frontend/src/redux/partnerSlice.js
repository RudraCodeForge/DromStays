import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  partnerId: null,
};

const partnerSlice = createSlice({
  name: "partner",
  initialState,
  reducers: {
    setPartnerFromBackend: (state, action) => {
      state.partnerId = action.payload;
    },

    clearPartner: (state) => {
      state.partnerId = null;
    },
  },
});

export const { setPartnerFromBackend, clearPartner } = partnerSlice.actions;
export default partnerSlice.reducer;
