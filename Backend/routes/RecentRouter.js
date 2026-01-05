const express = require("express");
const RecentRouter = express.Router();
const RecentController = require("../controllers/RecentController");
const authMiddleware = require("../middlewares/authMiddleware");

RecentRouter.get(
  "/recent",
  authMiddleware,
  RecentController.getRecentActivities
);
module.exports = RecentRouter;
