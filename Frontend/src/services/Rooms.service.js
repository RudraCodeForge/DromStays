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
