const Payment = require("../models/Payment");

exports.getAdvancePaymentsByOwnerId = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const payments = await Payment.find({ owner: ownerId, type: "ADVANCE" });
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getExpectedCollectionByOwnerId = async (req, res) => {
  try {
    const { ownerId } = req.params;

    const payments = await Payment.find({
      owner: ownerId,
      type: "RENT",
      status: "PENDING",
    }).populate({
      path: "tenant",
      select: "isActive fullName phone",
      match: { isActive: true }, // 🔥 ONLY ACTIVE TENANTS
    });

    // ❌ Remove payments whose tenant is inactive/null
    const activeTenantPayments = payments.filter((p) => p.tenant !== null);

    const totalExpected = activeTenantPayments.reduce(
      (sum, p) => sum + (p.amount || 0),
      0
    );

    res.status(200).json({
      success: true,
      data: activeTenantPayments,
      totalExpected,
    });
  } catch (error) {
    console.error("Expected collection error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
