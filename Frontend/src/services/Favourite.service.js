import api from "./api.service";

export const addRoomToFavourites = async (roomId) => {
  try {
    const response = await api.post(`/favourites/rooms/${roomId}/favourite`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkFavourite = async (roomId) => {
  try {
    const res = await api.get(`/favourites/check/${roomId}`);
    return res.data;
  } catch (error) {
    console.error("Check favourite error:", error?.response?.data || error);
    throw error?.response?.data || error;
  }
};

export const getMyFavourites = async () => {
  try {
    const res = await api.get("/favourites/my-favourites");
    return res.data;
  } catch (error) {
    console.error("Get favourites error:", error?.response?.data || error);
    throw error?.response?.data || error;
  }
};
