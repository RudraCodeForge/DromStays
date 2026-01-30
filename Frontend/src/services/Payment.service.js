import api from "./api.service";
import handleServerError from "../Helper/ServerErrorhelper";
import handleAuthError from "../Helper/AuthErrorHelper";

/* ================= DASHBOARD PAYMENTS ================= */
export const DashboardPayments = async (ownerId) => {
  try {
    const res = await api.get(`/payments/dashboard/owner/${ownerId}`);
    return res.data;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;

    throw error.response?.data || {
      message: "Failed to fetch dashboard payments",
    };
  }
};

export const getOwnerPayments = async () => {
  try {
    const res = await api.get("/payments/owner");
    return res.data;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;

    throw error.response?.data || {
      message: "Failed to fetch owner payments",
    };
  }
};
