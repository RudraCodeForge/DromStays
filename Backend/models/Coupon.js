const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    createdByType: {
      type: String,
      enum: ["admin", "owner", "partner"],
      required: true,
    },

    applicableOn: {
      type: String,
      enum: ["all", "platform", "service", "property"],
      default: "platform",
      required: true,
    },

    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    maxDiscount: {
      type: Number,
      min: 0,
      default: null,
    },
    minOrderValue: {
      type: Number,
      min: 0,
      default: 0,
    },
    usageLimit: {
      type: Number,
      min: 1,
      default: null,
    },
    usedCount: {
      type: Number,
      min: 0,
      default: 0,
    },
    perUserLimit: {
      type: Number,
      min: 1,
      default: 1,
    },

    validFrom: {
      type: Date,
      required: true,
    },
    validUntil: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["draft", "pending", "approved", "rejected", "expired", "disabled"],
      default: "draft",
    },

    rejectedReason: {
      type: String,
      trim: true,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);
couponSchema.index({ status: 1 });
couponSchema.index({ createdBy: 1 });
couponSchema.index({ applicableOn: 1 });
couponSchema.index({ validFrom: 1, validUntill: 1 });

module.exports = mongoose.model("Coupon", couponSchema);
