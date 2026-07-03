import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  partner: null,
};

const partnerSlice = createSlice({
  name: "partner",
  initialState,
  reducers: {
    setPartnerFromBackend: (state, action) => {
      state.partner = action.payload;
    },

    clearPartner: (state) => {
      state.partner = null;
    },
  },
});

export const { setPartnerFromBackend, clearPartner } = partnerSlice.actions;
export default partnerSlice.reducer;
