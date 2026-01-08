const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },

    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

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

    type: {
      type: String,
      enum: ["ADVANCE", "RENT", "EXTRA", "REFUND"],
      required: true,
    },

    month: {
      type: String, // "2026-01"
      required: function () {
        return this.type === "RENT";
      },
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["PAID", "PENDING", "OVERDUE", "PARTIAL"],
      default: "PENDING",
    },

    paidAt: Date,
    dueDate: Date,
    notes: String,
  },
  { timestamps: true }
);

// ✅ THIS LINE WAS MISSING
module.exports = mongoose.model("Payment", PaymentSchema);
