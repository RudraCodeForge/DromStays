// services/Session.service.js
import api from "./api.service";
import handleServerError from "../Helper/ServerErrorhelper";

export const Get_Active_Sessions = async () => {
    try {
        const response = await api.get("/sessions/active");
        return response.data; // backend directly array bhej raha hai
    } catch (error) {
        handleServerError(error);
        throw error;
    }
};

export const Logout_Session = async (sessionId) => {
    try {
        await api.delete(`/sessions/logout-session/${sessionId}`);
    } catch (error) {
        handleServerError(error);
        throw error;
    }
};

export const Logout_All_Sessions = async () => {
    try {
        await api.delete("/sessions/logout-all-sessions");
    } catch (error) {
        handleServerError(error);
        throw error;
    }
};
