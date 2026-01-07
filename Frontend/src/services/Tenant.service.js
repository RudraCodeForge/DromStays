import api from "./api.service";

export const addTenantToRoom = async (tenantData) => {
  try {
    const response = await api.post("/tenants/addTenant", tenantData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTenantByRoomId = async (roomId) => {
  try {
    const response = await api.get(`/tenants/byRoomId/${roomId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTenantById = async (tenantId) => {
  try {
    const response = await api.delete(`/tenants/${tenantId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
