const express = require("express");
const CouponRouter = express.Router();
const CouponController = require("../controllers/Coupon.Controller");
const authMiddleware = require("../middlewares/authMiddleware");

CouponRouter.post("/verify", authMiddleware, CouponController.Verify_Coupon);

module.exports = CouponRouter;
