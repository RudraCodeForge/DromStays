const express = require("express");
const PaymentRouter = express.Router();
const PaymentController = require("../controllers/Payment.Controller");
const authMiddleware = require("../middlewares/authMiddleware");

PaymentRouter.get(
  "/dashboard/owner/:ownerId",
  authMiddleware,
  PaymentController.getOwnerDashboardPayments
);

PaymentRouter.get("/owner", authMiddleware, PaymentController.getOwnerPayments);

PaymentRouter.put(
  "/mark-as-paid",
  authMiddleware,
  PaymentController.markPaymentAsPaid
);


module.exports = PaymentRouter;
