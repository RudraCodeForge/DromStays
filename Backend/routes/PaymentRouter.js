const express = require("express");
const PaymentRouter = express.Router();
const PaymentController = require("../controllers/Payment.Controller");
const authMiddleware = require("../middlewares/authMiddleware");

PaymentRouter.get(
  "/advance/owner/:ownerId",
  authMiddleware,
  PaymentController.getAdvancePaymentsByOwnerId
);

PaymentRouter.get(
  "/expected/owner/:ownerId",
  authMiddleware,
  PaymentController.getExpectedCollectionByOwnerId // ✅ FIX HERE
);

module.exports = PaymentRouter;
