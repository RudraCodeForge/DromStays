import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,

  token: localStorage.getItem("accessToken") || null,
  role: localStorage.getItem("role") || null,

  isAuthenticated: !!localStorage.getItem("accessToken"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // ✅ Login success
    loginSuccess: (state, action) => {
      const { user, token, role } = action.payload;

      state.user = user;
      state.token = token;
      state.role = role;
      state.isAuthenticated = true;

      // 🔐 persistence
      localStorage.setItem("accessToken", token);
      localStorage.setItem("role", role);
      localStorage.setItem("user", JSON.stringify(user));

      console.log("Role stored in localStorage:", localStorage.getItem("role"));
    },

    // ✅ Logout
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
