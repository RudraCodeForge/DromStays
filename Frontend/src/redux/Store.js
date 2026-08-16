import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./authSlice";
import partnerReducer from "./partnerSlice";
import ownerReducer from "./ownerSlice";
import notificationReducer from "./notificationSlice";
import cartReducer from "./cartSlice";
import addressReducer from "./addressSlice";

import { persistStore, persistReducer } from "redux-persist";

import storage from "redux-persist/lib/storage";

const cartPersistConfig = {
  key: "cart",
  storage,
};

const addressPersistConfig = {
  key: "address",
  storage,
};

const cartPersistedReducer = persistReducer(cartPersistConfig, cartReducer);
const addressPersistedReducer = persistReducer(
  addressPersistConfig,
  addressReducer,
);

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationReducer,
    partner: partnerReducer,
    owner: ownerReducer,
    cart: cartPersistedReducer,
    address: addressPersistedReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/REGISTER",
          "persist/FLUSH",
        ],
      },
    }),
});

export const persistor = persistStore(store);

export default store;
