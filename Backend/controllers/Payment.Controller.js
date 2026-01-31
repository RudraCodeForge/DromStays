const Payment = require("../models/Payment");
const User = require("../models/User");
const Notification = require("../models/Notification");
const Invoice = require("../models/Invoice");

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

    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

    /* 🔹 ADVANCE BALANCE (same as before) */
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

    /* 🔹 CURRENT MONTH RENT PAYMENTS (ALL STATUSES EXCEPT ADVANCE) */
    const rentPayments = await Payment.find({
      owner: ownerId,
      type: "RENT",
      month: currentMonth,
    }).populate({
      path: "tenant",
      select: "isActive",
      match: { isActive: true },
    });

    let expectedCollection = 0;
    let overdueAmount = 0;

    rentPayments.forEach((p) => {
      if (!p.tenant) return;

      const amount = p.amount || 0;

      // 🔥 Expected collection = ALL rent of current month
      expectedCollection += amount;

      // 🔥 Overdue logic
      if (p.dueDate) {
        const due = new Date(p.dueDate);
        due.setHours(0, 0, 0, 0);

        if (due < today && p.status !== "PAID") {
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
        month: currentMonth,
      },
    });
  } catch (error) {
    console.error("getOwnerDashboardPayments error:", error);
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

    const {
      paymentId,
      paymentMethod = "MANUAL",
      paymentMode = "FULL", // FULL | PARTIAL
      amount, // PARTIAL case me required
    } = req.body;

    /* 🔒 ROLE CHECK */
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

    /* 🔍 FETCH PAYMENT */
    const payment = await Payment.findById(paymentId).populate(
      "property",
      "name"
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    /* 🔒 OWNER SECURITY */
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

    /* =========================
       🔥 FULL PAYMENT
    ========================== */
    if (paymentMode === "FULL") {
      payment.status = "PAID";
      payment.paymentMethod = paymentMethod;
      payment.paidAt = new Date();
      await payment.save();
    }

    /* =========================
       🔥 PARTIAL PAYMENT (FIXED)
    ========================== */
    if (paymentMode === "PARTIAL") {
      if (!amount || amount <= 0 || amount >= payment.amount) {
        return res.status(400).json({
          success: false,
          message: "Invalid partial payment amount",
        });
      }

      const remainingAmount = payment.amount - Number(amount);

      /* 🔥 UPDATE OLD PAYMENT → REMAINING */
      payment.amount = remainingAmount;
      payment.status = remainingAmount === 0 ? "PAID" : "PARTIAL";
      await payment.save();

      /* 🔥 CREATE NEW PAID PAYMENT */
      await Payment.create({
        tenant: payment.tenant,
        room: payment.room,
        property: payment.property,
        owner: ownerId,
        invoice: payment.invoice,
        type: payment.type,
        month: payment.month,
        amount: Number(amount),
        status: "PAID",
        paymentMethod,
        paidAt: new Date(),
      });
    }

    /* =========================
       🔄 UPDATE INVOICE
    ========================== */
    if (payment.invoice) {
      const invoice = await Invoice.findById(payment.invoice);

      if (invoice) {
        const paidPayments = await Payment.find({
          invoice: invoice._id,
          status: "PAID",
        });

        const totalPaid = paidPayments.reduce(
          (sum, p) => sum + (p.amount || 0),
          0
        );

        if (totalPaid >= invoice.totalAmount) {
          invoice.paymentStatus = "Paid";
        } else {
          invoice.paymentStatus = "Partial";
        }

        invoice.paymentMethod = paymentMethod;
        await invoice.save();
      }
    }

    /* =========================
       🔔 NOTIFICATION
    ========================== */
    await Notification.create({
      user: payment.tenant,
      title: "Payment Update",
      message:
        paymentMode === "FULL"
          ? `Your payment for ${payment.property?.name || "property"
          } has been marked as PAID.`
          : `A partial payment has been received for ${payment.property?.name || "property"
          }.`,
      type: "PAYMENT",
      data: {
        paymentId: payment._id,
        mode: paymentMode,
        amount: paymentMode === "PARTIAL" ? amount : payment.amount,
      },
      redirectUrl: "/my-payments",
    });

    return res.status(200).json({
      success: true,
      message:
        paymentMode === "FULL"
          ? "Payment marked as PAID successfully"
          : "Partial payment recorded successfully",
    });
  } catch (error) {
    console.error("markPaymentAsPaid error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update payment",
    });
  }
};
