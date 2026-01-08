import api from "./api.service";

export const ContactSupport = async (data) => {
  try {
    const response = await api.post("/support/contact", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
