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
        ref: "Tenant",
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
      required: true,
      min: 1,
    },

    pricing: {
      billingType: {
        type: String,
        enum: ["daily", "monthly"],
        required: true,
      },

      singleOccupancy: {
        dailyRent: { type: Number, min: 0 },
        monthlyRent: { type: Number, min: 0 },
      },

      sharing: {
        perPersonDailyRent: { type: Number, min: 0 },
        perPersonMonthlyRent: { type: Number, min: 0 },
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

    rules: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

/* 🔒 Unique room per property */
RoomSchema.index({ property: 1, roomNumber: 1 }, { unique: true });

/* 🧠 Virtuals */
RoomSchema.virtual("occupancyMode").get(function () {
  return this.tenants.length > 1 ? "sharing" : "single";
});

RoomSchema.virtual("rentPerTenant").get(function () {
  const count = this.tenants.length || 1;

  if (count > 1) {
    return this.pricing.billingType === "daily"
      ? this.pricing.sharing.perPersonDailyRent
      : this.pricing.sharing.perPersonMonthlyRent;
  }

  return this.pricing.billingType === "daily"
    ? this.pricing.singleOccupancy.dailyRent
    : this.pricing.singleOccupancy.monthlyRent;
});

RoomSchema.virtual("currentOccupancy").get(function () {
  return this.tenants.length;
});

/* 🔄 AUTO AVAILABILITY (SYNC HOOK — NO next) */
RoomSchema.pre("save", function () {
  this.isAvailable = this.tenants.length < this.capacity;
});

/* 📦 Enable virtuals */
RoomSchema.set("toJSON", { virtuals: true });
RoomSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Room", RoomSchema);
