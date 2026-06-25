const mongoose = require("mongoose");

const ConsentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  consentGiven: {
    type: Boolean,
    required: true,
  },
  consentType: {
    type: String,
    enum: [
      "dataProcessing",
      "marketing",
      "thirdPartySharing",
      "persolalizedAds",
      "bankDetails",
    ],
    default: "dataProcessing",
  },
  consentDate: {
    type: Date,
    default: Date.now,
  },
  constentTime: {
    type: String,
    default: new Date().toLocaleTimeString(),
  },
});
module.exports = mongoose.model("Consent", ConsentSchema);
