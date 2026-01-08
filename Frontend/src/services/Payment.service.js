import api from "./api.service";

export const DashboardPayments = async (ownerId) => {
  try {
    const response = await api.get(`/payments/dashboard/owner/${ownerId}`);
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      throw error.response.data;
    }
    throw { message: "Server error" };
  }
};
