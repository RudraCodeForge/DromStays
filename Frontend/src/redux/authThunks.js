import api from "../services/api.service";
import { setUserFromBackend, authCheckFinished } from "./authSlice";
import { setPartnerFromBackend } from "./partnerSlice";
import { setOwnerFromBackend } from "./ownerSlice";

export const fetchCurrentUser = () => async (dispatch) => {
  try {
    const res = await api.get("/auth/me");
    dispatch(setUserFromBackend(res.data.user));
    dispatch(setPartnerFromBackend(res.data.partner));
    dispatch(setOwnerFromBackend(res.data.owner));
  } catch (err) {
    console.log("/auth/me failed:", err.response?.status);

    // 🔥 THIS WAS MISSING
    dispatch(authCheckFinished());
  }
};
