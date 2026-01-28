const express = require("express");
const RecentRouter = express.Router();
const RecentController = require("../controllers/Recent.Controller");
const authMiddleware = require("../middlewares/authMiddleware");

RecentRouter.get(
  "/recent",
  authMiddleware,
  RecentController.getRecentActivities
);

RecentRouter.get(
  "/login_activities",
  authMiddleware,
  RecentController.GET_LOGIN_ACTIVITY
);
module.exports = RecentRouter;
