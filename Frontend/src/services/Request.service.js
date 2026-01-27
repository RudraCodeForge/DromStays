import api from "./api.service";
import handleServerError from "../Helper/ServerErrorhelper";
import handleAuthError from "../Helper/AuthErrorHelper";

/* ================= MAKE REQUEST ================= */
export const makeRequest = async (payload) => {
  try {
    const res = await api.post("/requests/make_request", payload);
    return res.data;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;

    throw error.response?.data || {
      message: "Failed to make request",
    };
  }
};

/* ================= GET REQUESTS BY ID ================= */
export const getRequestsbyId = async () => {
  try {
    const res = await api.get("/requests/Get_Requests");
    return res.data;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;

    throw error.response?.data || {
      message: "Failed to fetch requests",
    };
  }
};

/* ================= RESPOND TO REQUEST ================= */
export const respondToRequest = async (payload) => {
  try {
    const res = await api.post("/requests/respond", payload);
    return res.data;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;

    throw error.response?.data || {
      message: "Failed to respond to request",
    };
  }
};

/* ================= MARK REQUEST COMPLETED ================= */
export const markCompleted = async (requestId) => {
  try {
    const res = await api.post("/requests/mark_completed", { requestId });
    return res.data;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;

    throw error.response?.data || {
      message: "Failed to mark request as completed",
    };
  }
};
