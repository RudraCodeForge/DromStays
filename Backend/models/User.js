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
      select: false, // 🔐 VERY IMPORTANT
    },

    ProfilePicture: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },

    Address: {
      houseNo: String,
      street: String,
      locality: String,
      city: String,
      state: String,
      pincode: {
        type: String,
        match: /^[0-9]{6}$/,
      },
    },

    isProfileComplete: {
      type: Boolean,
      default: false,
    },

    RefreshToken: {
      type: String,
      default: null,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    WalletBalance: {
      type: Number,
      default: 0,
    },

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
