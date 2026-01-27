import api from "./api.service";
import handleServerError from "../Helper/ServerErrorhelper";
import handleAuthError from "../Helper/AuthErrorHelper";

/* ================= ADD TENANT TO ROOM ================= */
export const addTenantToRoom = async (tenantData) => {
  try {
    const res = await api.post("/tenants/addTenant", tenantData);
    return res.data;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;

    throw error.response?.data || {
      message: "Failed to add tenant",
    };
  }
};

/* ================= GET TENANTS BY ROOM ID ================= */
export const getTenantByRoomId = async (roomId) => {
  try {
    const res = await api.get(`/tenants/byRoomId/${roomId}`);
    return res.data;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;

    throw error.response?.data || {
      message: "Failed to fetch tenants",
    };
  }
};

/* ================= DELETE TENANT BY ID ================= */
export const deleteTenantById = async (tenantId) => {
  try {
    const res = await api.delete(`/tenants/${tenantId}`);
    return res.data;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;

    throw error.response?.data || {
      message: "Failed to delete tenant",
    };
  }
};
