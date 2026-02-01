const mongoose = require("mongoose");
const RoomBookingSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    billingType: {
      type: String,
      enum: ["daily", "monthly"],
      required: true,
    },

    bookingDate: {
      type: Date,
      required: true,
    },

    billingCycleDay: {
      type: Number,
      min: 1,
      max: 31,
    },

    rentAmount: {
      type: Number,
      required: true,
    },

    advanceAmount: {
      type: Number,
      default: 0,
    },

    advanceAdjusted: {
      type: Number,
      default: 0,
    },

    lastRentPaidDate: Date,

    nextDueDate: {
      type: Date,
      required: true,
    },

    totalDue: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["active", "ended"],
      default: "active",
    },

    agreementPdf: {
      type: String,
    },

    agreementGeneratedAt: {
      type: Date,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("RoomBooking", RoomBookingSchema);
