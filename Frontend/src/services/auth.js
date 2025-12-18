import api from "./api";

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
