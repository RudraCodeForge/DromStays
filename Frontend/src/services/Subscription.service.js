import api from "./api.service";
import handleServerError from "../Helper/ServerErrorhelper";
import handleAuthError from "../Helper/AuthErrorHelper";

/* ================= GET SUBSCRIPTION PLANS ================= */
export const getSubscriptionPlans = async () => {
  try {
    const res = await api.get("/subscriptions/Get_Subscriptions");
    return res.data.plans;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;

    throw error.response?.data || {
      message: "Failed to fetch subscription plans",
    };
  }
};

/* ================= SUBSCRIBE TO PLAN ================= */
export const subscribeToPlan = async (planName) => {
  try {
    const res = await api.post("/subscriptions/Subscribe", { planName });
    return res.data;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;

    throw error.response?.data || {
      message: "Failed to subscribe to plan",
    };
  }
};
