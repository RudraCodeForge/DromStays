const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tenants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],

    roomNumber: {
      type: String,
      required: true,
      trim: true,
    },

    floor: {
      type: Number,
      default: 0,
    },

    capacity: {
      type: Number,
      required: true, // total persons allowed
      min: 1,
    },

    pricing: {
      billingType: {
        type: String,
        enum: ["daily", "monthly"],
        required: true,
      },

      singleOccupancy: {
        dailyRent: {
          type: Number,
          min: 0,
        },
        monthlyRent: {
          type: Number,
          min: 0,
        },
      },

      sharing: {
        perPersonDailyRent: {
          type: Number,
          min: 0,
        },
        perPersonMonthlyRent: {
          type: Number,
          min: 0,
        },
      },
    },

    roomType: {
      type: String,
      enum: ["Single", "Double", "Triple", "Dormitory"],
      required: true,
    },

    amenities: {
      type: [String],
      default: [],
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

/* 🔒 Unique room number per property */
RoomSchema.index({ property: 1, roomNumber: 1 }, { unique: true });

module.exports = mongoose.model("Room", RoomSchema);
