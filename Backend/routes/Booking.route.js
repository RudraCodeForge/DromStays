const express = require("express");
const BookingRouter = express.Router();
const BookingController = require("../controllers/Booking.Controller");
const authMiddleware = require("../middlewares/authMiddleware");

BookingRouter.get("/", authMiddleware, BookingController.GET_ALL_BOOKINGS)

module.exports = BookingRouter;