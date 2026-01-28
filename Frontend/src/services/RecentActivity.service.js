import api from "./api.service";
import handleServerError from "../Helper/ServerErrorhelper";
import handleAuthError from "../Helper/AuthErrorHelper";

/* ================= GET ALL ACTIVITIES ================= */
export const Get_All_Activities = async () => {
  try {
    const res = await api.get("/activities/recent");
    return res.data;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;

    throw error.response?.data || {
      message: "Failed to fetch activities",
    };
  }
};

export const Get_Login_Activities = async () => {
  try {
    const res = await api.get("/activities/login_activities");
    return res.data;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;
    throw error.response?.data || {
      message: "Failed to fetch login activities",
    };
  }
};