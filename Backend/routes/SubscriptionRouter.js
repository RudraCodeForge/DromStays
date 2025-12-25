const express = require("express");
const SubscriptionRouter = express.Router();
const SubscriptionController = require("../controllers/SubscriptionController");
const authMiddleware = require("../middlewares/authMiddleware");

SubscriptionRouter.get(
  "/Get_Subscriptions",
  authMiddleware,
  SubscriptionController.GET_SUBSCRIPTIONS
);

SubscriptionRouter.post(
  "/Subscribe",
  authMiddleware,
  SubscriptionController.SUBSCRIBE_TO_PLAN
);

module.exports = SubscriptionRouter;
