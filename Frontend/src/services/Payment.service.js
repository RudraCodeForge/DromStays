import api from "./api.service";

export const Get_Advance_paymentsByOwnerId = async (ownerId) => {
  try {
    const response = await api.get(`/payments/advance/owner/${ownerId}`);
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      throw error.response.data;
    }
    throw { message: "Server error" };
  }
};

export const Expected_Advance_PaymentsByOwnerId = async (ownerId) => {
  try {
    const response = await api.get(`/payments/expected/owner/${ownerId}`);
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      throw error.response.data;
    }
    throw { message: "Server error" };
  }
};
