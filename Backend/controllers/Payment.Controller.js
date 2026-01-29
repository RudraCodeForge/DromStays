const Payment = require("../models/Payment");
const User = require("../models/User");

exports.getOwnerDashboardPayments = async (req, res) => {
  try {
    const { ownerId } = req.params;

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
