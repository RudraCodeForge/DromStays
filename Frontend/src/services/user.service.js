import api from "./api.service";
import handleServerError from "../Helper/ServerErrorhelper";
import handleAuthError from "../Helper/AuthErrorHelper";

/* ================= UPDATE PROFILE ================= */
export const updateProfileApi = async (profileData) => {
  try {
    const res = await api.put("/user/profile", profileData);
    return res.data;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;

    throw error.response?.data || {
      message: "Failed to update profile",
    };
  }
};

/* ================= UPDATE PROFILE PICTURE ================= */
export const updateProfilePictureApi = async (pictureData) => {
  try {
    const res = await api.put("/user/profilePicture", pictureData);
    return res.data;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;

    throw error.response?.data || {
      message: "Failed to update profile picture",
    };
  }
};
