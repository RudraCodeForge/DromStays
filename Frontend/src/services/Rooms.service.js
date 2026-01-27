import api from "./api.service";

export const Get_Owner_Property_Rooms = async (propertyId) => {
  try {
    const query = propertyId ? `?propertyId=${propertyId}` : "";
    const response = await api.get(`/rooms/owner_rooms${query}`);
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      throw error.response.data;
    }
    throw { success: false, message: "Server error" };
  }
};

export const Get_Owner_Rooms = async () => {
  try {
    const response = await api.get("/rooms/owner_rooms");
    return response.data;
  } catch (error) {
    const status = error.response?.status;
    if (status === 401) {
      window.location.href = "/login";
      return;
    }

    if (status === 403) {
      window.location.href = "/unauthorized";
      return;
    }
    if (status >= 500) {
      window.location.href = "/server-error";
      return;
    }
    if (error.response?.data) {
      throw error.response.data;
    }
    throw { success: false, message: "Server error" };
  }
};

export const getRoomById = async (roomId) => {
  try {
    const response = await api.get(`/rooms/${roomId}`);
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      throw error.response.data;
    }
    throw { success: false, message: "Server error" };
  }
};

export const updateRoomById = async (roomId, payload) => {
  try {
    const response = await api.put(`/rooms/${roomId}`, payload);
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      throw error.response.data;
    }
    throw { success: false, message: "Server error" };
  }
};

export const Get_Property_Rooms = async (propertyId) => {
  try {
    if (!propertyId) {
      throw { success: false, message: "Property ID is required" };
    }

    const response = await api.get(`/rooms/property/${propertyId}/rooms`);

    return response.data;
  } catch (error) {
    if (error.response?.data) {
      throw error.response.data;
    }
    throw { success: false, message: "Server error" };
  }
};
