import api from "./api";

export const updateProfileApi = async (profileData) => {
  try {
    const response = await api.put("/user/profile", profileData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw { success: false, message: "Server error" };
  }
};
