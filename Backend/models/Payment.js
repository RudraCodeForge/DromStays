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

    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
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

    paymentMethod: {
      type: String,
      enum: ["CASH", "UPI", "MANUAL"],
      default: "MANUAL",
    },

    paidAt: Date,
    dueDate: Date,
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
