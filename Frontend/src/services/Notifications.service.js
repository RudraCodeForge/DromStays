import api from './api.service';

export const fetchNotifications = async () => {
    try {
        const response = await api.get('/notifications');
        return response.data;
    }
    catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
    }
};

export const fetchUnreadCount = async () => {
    try {
        const response = await api.get("/notifications/unread-count");
        return response.data.unreadCount; // ✅ ONLY NUMBER
    } catch (error) {
        console.error("Error fetching unread notification count:", error);
        throw error;
    }
};

export const markNotificationAsRead = async (notificationId) => {
    try {
        const response = await api.post(`/notifications/${notificationId}/mark-as-read`);
        return response.data;
    } catch (error) {
        console.error("Error marking notification as read:", error);
        throw error;
    }
};
