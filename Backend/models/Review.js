const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    // 🔹 Reviewer (userId se role nikal loge)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ⭐ Optional title
    title: {
      type: String,
      trim: true,
      maxlength: 50,
      default: null,
    },

    // ⭐ Rating
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // 📝 Review message
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
    },

    // 🔹 Review target
    reviewType: {
      type: String,
      enum: ["PLATFORM", "ROOM", "OWNER", "SERVICE"],
      default: "PLATFORM",
    },

    // 🔹 Reference (roomId / ownerId / serviceId)
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    // 🔹 Related request (verification ke liye)
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      default: null,
    },

    // 🔹 Snapshot (request TTL ke baad bhi review safe rahe)
    snapshot: {
      propertyName: String,
      roomNo: String,
      ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },

    // 🔹 Admin moderation
    isApproved: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

// ✅ Same user same cheez ko dubara review nahi kar sakta
reviewSchema.index(
  { user: 1, reviewType: 1, referenceId: 1 },
  { unique: true }
);

module.exports = mongoose.model("Review", reviewSchema);
