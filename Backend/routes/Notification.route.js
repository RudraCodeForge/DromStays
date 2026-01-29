const express = require("express");
const NotificationRouter = express.Router();
const NotificationController = require("../controllers/Notification.Controller");
const authMiddleware = require("../middlewares/authMiddleware");

NotificationRouter.get("/", authMiddleware, NotificationController.getNotifications);

NotificationRouter.get("/unread-count", authMiddleware, NotificationController.getUnreadNotificationCount);
NotificationRouter.post("/:id/mark-as-read", authMiddleware, NotificationController.markNotificationAsRead);


module.exports = NotificationRouter;
