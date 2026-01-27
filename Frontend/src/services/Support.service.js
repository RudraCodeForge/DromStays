import api from "./api.service";
import handleServerError from "../Helper/ServerErrorhelper";
import handleAuthError from "../Helper/AuthErrorHelper";

/* ================= CONTACT SUPPORT ================= */
export const ContactSupport = async (data) => {
  try {
    const res = await api.post("/support/contact", data);
    return res.data;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;

    throw error.response?.data || {
      message: "Failed to contact support",
    };
  }
};

/* ================= CREATE TICKET ================= */
export const CreateTicket = async (data) => {
  try {
    const res = await api.post("/support/tickets", data);
    return res.data;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;

    throw error.response?.data || {
      message: "Failed to create ticket",
    };
  }
};

/* ================= GET TICKETS ================= */
export const GetTickets = async () => {
  try {
    const res = await api.get("/support/tickets");
    return res.data;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;

    throw error.response?.data || {
      message: "Failed to fetch tickets",
    };
  }
};

/* ================= GET TICKET DETAILS ================= */
export const GetTicketDetails = async (ticketId) => {
  try {
    const res = await api.get(`/support/tickets/${ticketId}`);
    return res.data;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;

    throw error.response?.data || {
      message: "Failed to fetch ticket details",
    };
  }
};

/* ================= SEND TICKET MESSAGE ================= */
export const SendTicketMessage = async (ticketId, message) => {
  try {
    const res = await api.post(`/support/tickets/${ticketId}/message`, {
      message,
    });
    return res.data;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;

    throw error.response?.data || {
      message: "Failed to send ticket message",
    };
  }
};
