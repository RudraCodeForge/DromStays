const express = require("express");
const SubscriptionRouter = express.Router();
const SubscriptionController = require("../controllers/SubscriptionController");
const authMiddleware = require("../middlewares/authMiddleware");

SubscriptionRouter.get(
  "/Get_Subscriptions",
  authMiddleware,
  SubscriptionController.GET_SUBSCRIPTIONS
);

module.exports = SubscriptionRouter;
