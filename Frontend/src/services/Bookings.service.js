import api from "./api.service";
import handleServerError from "../Helper/ServerErrorhelper";
import handleAuthError from "../Helper/AuthErrorHelper";

export const get_Bookings = async () => {
    try {
        const response = await api.get("/Bookings");
        return response.data;
    } catch (error) {
        if (handleServerError(error)) return;
        if (handleAuthError(error)) return;

        throw error.response?.data || {
            message: "Failed to fetch Bookings",
        };
    }
}