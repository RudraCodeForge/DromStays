const mongoose = require("mongoose");

const recentActivitySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    entityType: {
      type: String,
      enum: ["PROPERTY", "ROOM", "BOOKING", "PAYMENT", "SERVICE"],
      required: true,
      index: true,
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    action: {
      type: String,
      enum: [
        "CREATED",
        "UPDATED",
        "DELETED",
        "BOOKED",
        "CANCELLED",
        "PAID",
        "FAILED",
        "COMPLETED",
      ],
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    meta: {
      type: Object, // 💡 extra data (amount, dates, etc.)
      default: {},
    },

    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 60 * 24 * 7, // 🔥 AUTO DELETE AFTER 7 DAYS
    },
  },
  { timestamps: false }
);

module.exports = mongoose.model("RecentActivity", recentActivitySchema);
