const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
      index: true,
    },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomBooking",
      default: null,
    },

    services: [
      {
        service: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Service",
          required: true,
        },

        serviceName: {
          type: String,
          default: null,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        total: {
          type: Number,
          required: true,
          min: 0,
        },
        partner: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Partner,
          default: null,
        },
        status: {
          type: String,
          enum: [
            "pending",
            "assigned",
            "accepted",
            "partner_travelling",
            "arrived",
            "in_progress",
            "completed",
            "cancelled",
          ],
          default: "pending",
        },
      },
    ],

    pricing: {
      bookingTotal: {
        type: Number,
        default: 0,
        min: 0,
      },
      serviceTotal: {
        type: Number,
        default: 0,
        min: 0,
      },
      subTotal: {
        type: Number,
        default: 0,
        min: 0,
      },
      discount: {
        type: Number,
        default: 0,
        min: 0,
      },
      tax: {
        type: Number,
        default: 0,
        min: 0,
      },
      platformFee: {
        type: Number,
        default: 49,
        min: 0,
      },
      finalAmount: {
        type: Number,
        required: true,
        min: 0,
      },
    },

    coupon: {
      code: {
        type: String,
        default: null,
      },
      couponId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon",
        default: 0,
      },
      discountAmount: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    payment: {
      method: {
        type: String,
        enum: ["razorpay", "cash"],
        default: "razorpay",
      },

      status: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded", "partially_refunded"],
        default: "pending",
      },

      razorpayOrderId: {
        type: String,
        default: null,
      },

      razorpayPaymentId: {
        type: String,
        default: null,
      },

      paidAt: {
        type: Date,
        default: null,
      },

      refundAmount: {
        type: Number,
        default: 0,
        min: 0,
      },

      refundedAt: {
        type: Date,
        default: null,
      },
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "completed", "cancelled"],
      default: "pending",
      index: true,
    },

    customer: {
      name: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
      },

      address: {
        type: String,
        default: null,
      },
    },

    notes: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Order", couponSchema);
