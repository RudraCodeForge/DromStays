const mongoose = require("mongoose");

const TenantSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    // 🔑 Platform linking (if tenant registers later)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    isRegistered: {
      type: Boolean,
      default: false,
    },

    // 🏠 Tenant can have multiple rooms
    rooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
      },
    ],

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

    joinedAt: {
      type: Date,
      default: Date.now,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

//
// 🔒 UNIQUE RULES (BEST & FUTURE-SAFE)
//

// 1️⃣ Same phone cannot be active twice in same property
TenantSchema.index(
  { phone: 1, property: 1 },
  {
    unique: true,
    partialFilterExpression: { isActive: true },
  }
);

// 2️⃣ Same email cannot be active twice (email optional)
TenantSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: {
      email: { $exists: true, $ne: null },
      isActive: true,
    },
  }
);

module.exports = mongoose.model("Tenant", TenantSchema);
