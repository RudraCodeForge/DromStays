const mongoose = require("mongoose");

const VerificationSchema = new mongoose.Schema({
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Partner",
    required: true,
    unique: true,
  },

  liveSelfieUrl: {
    type: String,
    required: true,
  },
  liveSelfiePublicId: {
    type: String,
    required: true,
  },

  aadhaarFrontUrl: {
    type: String,
    required: true,
  },
  aadhaarFrontPublicId: {
    type: String,
    required: true,
  },

  aadhaarBackUrl: {
    type: String,
    required: true,
  },
  aadhaarBackPublicId: {
    type: String,
    required: true,
  },

  addharno: {
    type: String,
    required: true,
  },
  gstno: {
    type: String,
    required: true,
  },
  panNo: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  rejectionReason: {
    type: String,
    default: "",
  },

  reviewedAt: Date,
});

module.exports = mongoose.model("Verification", VerificationSchema);
