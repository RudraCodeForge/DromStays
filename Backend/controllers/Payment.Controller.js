const Payment = require("../models/Payment");
const User = require("../models/User");
const Notification = require("../models/Notification");

exports.getOwnerDashboardPayments = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const owner = await User.findById(ownerId);
    if (!owner || owner.Role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    /* 🔹 ADVANCE BALANCE (Active tenants only) */
    const advancePayments = await Payment.find({
      owner: ownerId,
      type: "ADVANCE",
      status: "PAID",
    }).populate({
      path: "tenant",
      select: "isActive",
      match: { isActive: true },
    });

    const advanceBalance = advancePayments
      .filter((p) => p.tenant)
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    /* 🔹 PENDING + PARTIAL RENT */
    const pendingRents = await Payment.find({
      owner: ownerId,
      type: "RENT",
      status: { $in: ["PENDING", "PARTIAL"] },
    }).populate({
      path: "tenant",
      select: "isActive",
      match: { isActive: true },
    });

    let expectedCollection = 0;
    let overdueAmount = 0;

    pendingRents.forEach((p) => {
      if (!p.tenant) return;

      const amount = p.amount || 0;
      expectedCollection += amount;

      if (p.dueDate) {
        const due = new Date(p.dueDate);
        due.setHours(0, 0, 0, 0);

        if (due < today) {
          overdueAmount += amount;
        }
      }
    });

    return res.status(200).json({
      success: true,
      data: {
        advanceBalance,
        expectedCollection,
        overdueAmount,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


exports.getOwnerPayments = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const role = req.user.Role;

    if (role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Only owners can view received payments",
      });
    }

    const payments = await Payment.find({ owner: ownerId })
      .populate({
        path: "tenant",
        select: "fullName",
      })
      .populate({
        path: "property",
        select: "name",
      })
      .populate({
        path: "room",
        select: "roomNumber",
        options: { virtuals: false }, // ✅ extra safety
      })
      .sort({ createdAt: -1 })
      .lean(); // 🔥 MAIN FIX

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    console.error("getOwnerPayments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch owner payments",
    });
  }
};


exports.markPaymentAsPaid = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const role = req.user.Role;
    const { paymentId, paymentMethod } = req.body;

    if (role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Only owners can mark payments as paid",
      });
    }

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: "Payment ID is required",
      });
    }

    const payment = await Payment.findById(paymentId)
      .populate("property", "name");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    if (payment.owner.toString() !== ownerId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized payment access",
      });
    }

    if (payment.status === "PAID") {
      return res.status(400).json({
        success: false,
        message: "Payment already marked as PAID",
      });
    }

    // 🔥 UPDATE PAYMENT
    payment.status = "PAID";
    payment.paymentMethod = paymentMethod || "MANUAL";
    payment.paidAt = new Date();

    await payment.save();

    // 🔔 NOTIFICATION TO TENANT
    await Notification.create({
      user: payment.tenant,
      title: "Payment Received",
      message: `Your payment for ${payment.property?.name || "property"} has been marked as PAID.`,
      type: "PAYMENT",
      data: {
        paymentId: payment._id,
        amount: payment.amount,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Payment marked as PAID successfully",
      data: payment,
    });
  } catch (error) {
    console.error("markPaymentAsPaid error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to mark payment as paid",
    });
  }
};
