import api from "./api.service";
import handleServerError from "../Helper/ServerErrorhelper";
import handleAuthError from "../Helper/AuthErrorHelper";

export const submit_Partner_Profile = async (partnerData) => {
  try {
    const formData = new FormData();

    Object.entries(partnerData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    const res = await api.post("/partner/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;

    throw (
      error.response?.data || {
        message: "Failed to submit partner profile",
      }
    );
  }
};

export const CheckPartnerProfile = async () => {
  try {
    const res = await api.get("/partner/profile");

    return res.data; // 👈 IMPORTANT
  } catch (error) {
    if (handleServerError(error)) return;
    if (handleAuthError(error)) return;

    throw (
      error.response?.data || {
        message: "Failed to get partner profile",
      }
    );
  }
};
