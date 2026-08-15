import api from "./api.service";
import handleServerError from "../Helper/ServerErrorhelper";
import handleAuthError from "../Helper/AuthErrorHelper";

export const Verify_Coupon = async (couponCode) => {
  try {
    const response = await api.post("/Coupon/verify", { couponCode });
    return response.data;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;
    throw (
      error.response?.data || {
        message: "Failed to verify coupon",
      }
    );
  }
};
