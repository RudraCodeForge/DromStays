const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ⭐ Title (role based / admin editable)
    title: {
      type: String,
      trim: true,
      maxlength: 50,
      default: null,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 500,
    },

    reviewType: {
      type: String,
      enum: ["PLATFORM", "ROOM", "OWNER", "SERVICE"],
      default: "PLATFORM",
    },

    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    isApproved: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

// ✅ Composite uniqueness
reviewSchema.index(
  { user: 1, reviewType: 1, referenceId: 1 },
  { unique: true }
);

module.exports = mongoose.model("Review", reviewSchema);
