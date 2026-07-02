import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import partnerReducer from "./partnerSlice";
import ownerReducer from "./ownerSlice";
import notificationReducer from "./notificationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationReducer,
    partner: partnerReducer,
    owner: ownerReducer,
  },
});

export default store;
