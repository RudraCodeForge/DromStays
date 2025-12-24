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
      lowercase: true,
      trim: true,
    },

    Password: {
      type: String,
      required: true,
      select: false,
    },

    ProfilePicture: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },

    Address: {
      houseNo: { type: String, default: "" },
      street: { type: String, default: "" },
      locality: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      pincode: {
        type: String,
        match: /^[0-9]{6}$/,
        default: "",
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

    // 🔐 JWT TOKEN VERSIONING
    tokenVersion: {
      type: Number,
      default: 0,
    },

    // 🔐 RESET PASSWORD
    ResetPasswordToken: {
      type: String,
      default: null,
    },

    ResetPasswordExpiry: {
      type: Date,
      default: null,
    },

    // ✅ ✅ SUBSCRIPTION (CORRECT PLACE)
    Subscription: {
      planName: {
        type: String,
        enum: ["Basic", "Pro", "Premium"],
        default: null,
      },

      status: {
        type: String,
        enum: ["active", "expired", "cancelled"],
        default: null,
      },

      startDate: {
        type: Date,
        default: null,
      },

      endDate: {
        type: Date,
        default: null,
      },

      paymentId: {
        type: String,
        default: null,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
