const mongoose = require("mongoose");
const requestSchema = new mongoose.Schema(
  {
    requestType: {
      type: String,
      enum: ["special", "maintenance", "complaint", "room_visit"],
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    userName: {
      type: String,
      required: true,
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🔥 IMPORTANT IDS
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },

    propertyName: String,
    roomNo: String,

    message: {
      type: String,
      required: true,
      maxlength: 300,
    },

    visitDate: Date,
    visitTimeSlot: String,
    purposeOfVisit: String,

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    ownerResponse: {
      type: String,
      default: "",
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },

    reviewEligible: {
      type: Boolean,
      default: false,
    },

    deleteAfter: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Request", requestSchema);
