import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./authSlice";
import partnerReducer from "./partnerSlice";
import ownerReducer from "./ownerSlice";
import notificationReducer from "./notificationSlice";
import cartReducer from "./cartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationReducer,
    partner: partnerReducer,
    owner: ownerReducer,
    cart: cartReducer,
  },
});

export default store;
