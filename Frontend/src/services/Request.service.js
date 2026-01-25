import api from "./api.service";

export const makeRequest = async (payload) => {
  try {
    const response = await api.post("/requests/make_request", payload);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

export const getRequestsbyId = async () => {
  try {
    const response = await api.get("/requests/Get_Requests");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

export const respondToRequest = async (payload) => {
  try {
    const response = await api.post("/requests/respond", payload);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

export const markCompleted = async (requestId) => {
  try {
    const response = await api.post("/requests/mark_completed", { requestId });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};