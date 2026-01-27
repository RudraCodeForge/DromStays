import api from "./api.service";
import handleServerError from "../Helper/ServerErrorhelper";
import handleAuthError from "../Helper/AuthErrorHelper";

/* ================= LOGIN ================= */
export const Login = async (credentials) => {
  try {
    const res = await api.post("/auth/login", credentials);
    return res.data;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;
    throw error.response.data;
  }
};

/* ================= SIGNUP ================= */
export const Signup = async (userData) => {
  try {
    const res = await api.post("/auth/signup", userData);
    return res.data;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;
    throw error.response.data;
  }
};

/* ================= SEND VERIFICATION EMAIL ================= */
export const SendVerificationEmail = async () => {
  try {
    const res = await api.post("/auth/send-verification");
    return res.data;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;
    throw error.response.data;
  }
};

/* ================= VERIFY ACCOUNT ================= */
export const VerifyAccount = async (token) => {
  try {
    const res = await api.post(`/auth/verify?token=${token}`);
    return res.data;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;
    throw error.response.data;
  }
};

/* ================= UPDATE PASSWORD ================= */
export const Update_Password = async (credentials) => {
  try {
    const res = await api.post("/auth/change-password", credentials);
    return res.data;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;

    const errData = error.response.data;
    throw {
      message:
        errData?.message ||
        (Array.isArray(errData?.errors) && errData.errors.join(", ")) ||
        "Something went wrong. Please try again.",
    };
  }
};

/* ================= FORGET PASSWORD ================= */
export const Forget_Password = async (email) => {
  try {
    const res = await api.post("/auth/forget-password", { email });
    return res.data;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;

    const errData = error.response.data;
    throw {
      message:
        errData?.message ||
        (Array.isArray(errData?.errors) && errData.errors.join(", ")) ||
        "Something went wrong. Please try again.",
    };
  }
};

/* ================= RESET PASSWORD ================= */
export const Reset_Password = async (token, newPassword) => {
  try {
    const res = await api.post("/auth/reset-password", {
      token,
      newPassword,
    });
    return res.data;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;

    const errData = error.response.data;
    throw {
      message:
        errData?.message ||
        (Array.isArray(errData?.errors) && errData.errors.join(", ")) ||
        "Something went wrong",
    };
  }
};
