const express = require("express");
const RecentRouter = express.Router();
const RecentController = require("../controllers/Recent.Controller");
const authMiddleware = require("../middlewares/authMiddleware");

RecentRouter.get(
  "/recent",
  authMiddleware,
  RecentController.getRecentActivities
);
module.exports = RecentRouter;
