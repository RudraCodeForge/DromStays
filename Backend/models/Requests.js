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

    propertyName: {
      type: String,
      required: true,
    },

    roomNo: {
      type: String,
      required: true,
    },

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

    // 🔥 AUTO DELETE FIELD
    deleteAfter: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", requestSchema);
