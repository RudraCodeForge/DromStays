const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    partnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Partner",
      required: true,
    },

    serviceName: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      required: true,
    },

    // Keep single image for now
    coverImage: {
      type: String,
      required: true,
    },

    // Service Price
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // fixed | hourly | starting
    pricingType: {
      type: String,
      enum: ["fixed", "hourly", "starting"],
      default: "fixed",
    },

    // per hour | room | home | visit
    unit: {
      type: String,
      enum: ["job", "hour", "room", "home", "visit", "day"],
      default: "job",
    },

    // Estimated duration
    estimatedDuration: {
      type: Number,
      required: true,
      min: 1,
    },

    durationUnit: {
      type: String,
      enum: ["minutes", "hours", "days"],
      default: "hours",
    },

    status: {
      type: String,
      enum: ["Pending", "Active", "Inactive", "Rejected"],
      default: "Pending",
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    completedBookings: {
      type: Number,
      default: 0,
      min: 0,
    },

    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Service", serviceSchema);
