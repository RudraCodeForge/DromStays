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

export const GetTickets = async () => {
  try {
    const response = await api.get("/support/tickets");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetTicketDetails = async (ticketId) => {
  try {
    const response = await api.get(`/support/tickets/${ticketId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const SendTicketMessage = async (ticketId, message) => {
  try {
    const response = await api.post(`/support/tickets/${ticketId}/message`, {
      message,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
