const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    Role: {
      type: String,
      required: true,
      enum: ["owner", "tenant", "partner"],
    },

    Name: {
      type: String,
      required: true,
    },

    Phone: {
      type: String,
      required: true,
      unique: true,
    },

    Email: {
      type: String,
      required: true,
      unique: true,
    },

    Password: {
      type: String,
      required: true,
    },

    ProfilePicture: {
      type: String,
      default: "https://example.com/default-profile.png",
    },

    // 💥 MOST IMPORTANT FOR SECURE SYSTEM
    RefreshToken: {
      type: String,
      default: null,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    // Future payments ke liye useful
    WalletBalance: {
      type: Number,
      default: 0,
    },

    // User verification (optional)
    isVerified: {
      type: Boolean,
      default: false,
    },
    VerificationToken: {
      type: String,
      default: null,
    },
    VerificationTokenExpiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
