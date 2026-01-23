import api from "./api.service";

export const makeRequest = async (payload) => {
  try {
    const response = await api.post("/requests/make_request", payload);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};
