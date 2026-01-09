const Payment = require("../models/Payment");

exports.getOwnerDashboardPayments = async (req, res) => {
  try {
    const { ownerId } = req.params;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 🔹 Advance Balance
    const advancePayments = await Payment.find({
      owner: ownerId,
      type: "ADVANCE",
    }).populate({
      path: "tenant",
      select: "isActive",
      match: { isActive: true },
    });

    const advanceBalance = advancePayments
      .filter((p) => p.tenant) // sirf active tenants
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    // 🔹 Pending Rent (Active tenants only)
    const pendingRents = await Payment.find({
      owner: ownerId,
      type: "RENT",
      status: "PENDING",
    }).populate({
      path: "tenant",
      select: "isActive",
      match: { isActive: true },
    });

    let expectedCollection = 0;
    let overdueAmount = 0;

    pendingRents.forEach((p) => {
      if (!p.tenant || !p.dueDate) return;

      const due = new Date(p.dueDate);
      due.setHours(0, 0, 0, 0);

      const amount = p.amount || 0;

      // 🔹 Expected collection includes ALL pending rents
      expectedCollection += amount;

      // 🔹 Overdue is subset
      if (due < today) {
        overdueAmount += amount;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        advanceBalance,
        expectedCollection,
        overdueAmount,
      },
    });
  } catch (error) {
    console.error("Dashboard payment error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
