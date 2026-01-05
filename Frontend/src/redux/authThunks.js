import api from "../services/api.service";
import { setUserFromBackend, authCheckFinished } from "./authSlice";

export const fetchCurrentUser = () => async (dispatch) => {
  try {
    const res = await api.get("/auth/me");
    dispatch(setUserFromBackend(res.data.user));
  } catch (err) {
    console.log("/auth/me failed:", err.response?.status);

    // 🔥 THIS WAS MISSING
    dispatch(authCheckFinished());
  }
};
