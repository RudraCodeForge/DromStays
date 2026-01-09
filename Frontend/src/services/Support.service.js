import api from "./api.service";

export const ContactSupport = async (data) => {
  try {
    const response = await api.post("/support/contact", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CreateTicket = async (data) => {
  try {
    const response = await api.post("/support/tickets", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
