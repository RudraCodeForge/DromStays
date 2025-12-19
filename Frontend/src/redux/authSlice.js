import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  role: null,
  isAuthenticated: false,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.role = action.payload.user.Role;
      state.isAuthenticated = true;
      state.loading = false;
      localStorage.setItem("accessToken", action.payload.token);
    },

    setUserFromBackend: (state, action) => {
      state.user = action.payload;
      state.role = action.payload.Role;
      state.isAuthenticated = true;
      state.loading = false;
    },

    authCheckFinished: (state) => {
      state.loading = false; // 🔥 critical
    },

    logout: (state) => {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      state.loading = false;
      localStorage.removeItem("accessToken");
    },
  },
});

export const { loginSuccess, setUserFromBackend, authCheckFinished, logout } =
  authSlice.actions;

export default authSlice.reducer;
