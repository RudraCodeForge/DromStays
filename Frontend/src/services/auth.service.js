import api from "./api.service";

export const Login = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    return response.data; // ✅ success only
  } catch (error) {
    // ❌ yahan return mat karo
    throw error; // ✅ error bubble up
  }
};

export const Signup = async (userData) => {
  try {
    const response = await api.post("/auth/signup", userData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw { success: false, message: "Server error" };
  }
};
export const SendVerificationEmail = async () => {
  try {
    const response = await api.post("/auth/send-verification");
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      throw error.response.data;
    }
    throw { message: "Server error" };
  }
};
export const VerifyAccount = async (token) => {
  try {
    const response = await api.post(`/auth/verify?token=${token}`);
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      throw error.response.data;
    }
    throw { message: "Server error" };
  }
};

export const Update_Password = async (credentials) => {
  try {
    const response = await api.post("/auth/change-password", credentials);
    return response.data;
  } catch (error) {
    const errData = error.response?.data;

    // Always throw same shape
    throw {
      message:
        errData?.message ||
        (Array.isArray(errData?.errors) ? errData.errors.join(", ") : null) ||
        "Something went wrong. Please try again.",
    };
  }
};

export const Forget_Password = async (email) => {
  try {
    const response = await api.post("/auth/forget-password", { email });
    return response.data;
  } catch (error) {
    const errData = error.response?.data;

    const message =
      errData?.message ||
      (Array.isArray(errData?.errors) && errData.errors.join(", ")) ||
      error.message ||
      "Something went wrong. Please try again.";

    throw new Error(message);
  }
};

export const Reset_Password = async (token, newPassword) => {
  try {
    const response = await api.post("/auth/reset-password", {
      token,
      newPassword, // ✅ EXACT key backend expects
    });
    return response.data;
  } catch (error) {
    const errData = error.response?.data;
    throw new Error(
      errData?.message ||
        (Array.isArray(errData?.errors) && errData.errors.join(", ")) ||
        "Something went wrong"
    );
  }
};
