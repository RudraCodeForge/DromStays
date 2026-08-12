import api from "./api.service";
import handleServerError from "../Helper/ServerErrorhelper";
import handleAuthError from "../Helper/AuthErrorHelper";

export const SearchServices = async (data) => {
  try {
    const response = await api.post("/services/SearchServices", data);
    return response.data;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;
    throw (
      error.response?.data || {
        message: "Failed to search services",
      }
    );
  }
};

export const GetServiceByCategory = async (data) => {
  try {
    const response = await api.get("/services/GetServiceByCategory", {
      params: data,
    });
    return response.data?.data ?? response.data;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;
    throw (
      error.response?.data || {
        message: "Failed to get services by category",
      }
    );
  }
};

export const GetServiceById = async (serviceId) => {
  try {
    const response = await api.get(`/services/${serviceId}`);
    return response.data?.data ?? response.data;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;
    throw (
      error.response?.data || {
        message: "Failed to get service by ID",
      }
    );
  }
};
