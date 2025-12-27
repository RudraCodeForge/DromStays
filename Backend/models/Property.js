const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    propertyType: {
      type: String,
      required: true,
      enum: ["Hostel", "PG", "Flat", "Room"],
    },

    totalRooms: {
      type: Number,
      required: true,
      min: 1,
    },

    location: {
      city: {
        type: String,
        required: true,
        trim: true,
      },
      area: {
        type: String,
        required: true,
        trim: true,
      },
      address: {
        type: String,
        required: true,
        trim: true,
      },
      geo: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number], // [lng, lat]
          required: true,
        },
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

/// 📍 GeoSpatial Index (VERY IMPORTANT)
PropertySchema.index({ "location.geo": "2dsphere" });

module.exports = mongoose.model("Property", PropertySchema);
