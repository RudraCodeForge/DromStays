import api from "./api.service";
import handleServerError from "../Helper/ServerErrorhelper";
import handleAuthError from "../Helper/AuthErrorHelper";

/* ================= ADD TO FAVOURITES ================= */
export const addRoomToFavourites = async (roomId) => {
  try {
    const res = await api.post(`/favourites/rooms/${roomId}/favourite`);
    return res.data;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;

    throw error.response?.data || {
      message: "Failed to add room to favourites",
    };
  }
};

/* ================= CHECK FAVOURITE ================= */
export const checkFavourite = async (roomId) => {
  try {
    const res = await api.get(`/favourites/check/${roomId}`);
    return res.data;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;

    throw error.response?.data || {
      message: "Failed to check favourite",
    };
  }
};

/* ================= GET MY FAVOURITES ================= */
export const getMyFavourites = async () => {
  try {
    const res = await api.get("/favourites/my-favourites");
    return res.data;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;

    throw error.response?.data || {
      message: "Failed to fetch favourites",
    };
  }
};
