import api from "./api.service";

export const Get_All_Activities = async () => {
  try {
    const response = await api.get("/activities/recent");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw { success: false, message: "Server error" };
  }
};
