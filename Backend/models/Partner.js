const mongoose = require("mongoose");

const PartnerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    businessName: String,
    contactPerson: String,

    serviceCategory: String,
    experience: Number,
    skills: [String],
    languages: [String],

    city: String,
    serviceRadius: Number,
    workingHours: String,

    status: {
      type: String,
      default: "pending",
    },
    completepercentage: {
      type: Number,
      default: 0,
    },
    reviewedAt: Date,

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Partner", PartnerSchema);
