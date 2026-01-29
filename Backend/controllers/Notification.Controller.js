const Notification = require("../models/Notification.js");


exports.getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;

        const notifications = await Notification.find({ user: userId })
            .sort({ createdAt: -1 });

        res.status(200).json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getUnreadNotificationCount = async (req, res) => {
    try {
        const userId = req.user.id;
        const unreadCount = await Notification.countDocuments({ user: userId, isRead: false });
        res.status(200).json({ unreadCount });
    } catch (error) {
        console.error("Error fetching unread notification count:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.markNotificationAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const userId = req.user.id;
        const notification = await Notification.findOne({ _id: notificationId, user: userId });

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        notification.isRead = true;
        await notification.save();
        res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
