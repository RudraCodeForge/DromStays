const User = require("../models/User");
const plans = require("../config/Plans");
const { sendSubscriptionConfirmationEmail } = require("../utils/sendEmail");

// =========================
// GET SUBSCRIPTIONS
// =========================
exports.GET_SUBSCRIPTIONS = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("Role");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const availablePlans = plans.filter((plan) => plan.role === user.Role);

    return res.status(200).json({ plans: availablePlans });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

exports.SUBSCRIBE_TO_PLAN = async (req, res) => {
  try {
    const userId = req.user.id;
    const { planName } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.Role !== "owner") {
      return res
        .status(403)
        .json({ message: "Only owners can subscribe to plans" });
    }

    if (user.isVerified === false) {
      return res
        .status(403)
        .json({ message: "Please verify your account to subscribe to a plan" });
    }

    // ❌ Already active plan check
    if (user.Subscription?.status === "active") {
      return res
        .status(400)
        .json({ message: "You already have an active subscription" });
    }

    const selectedPlan = plans.find(
      (plan) => plan.name === planName && plan.role === user.Role
    );

    if (!selectedPlan) {
      return res.status(400).json({ message: "Invalid plan selected" });
    }

    const startDate = new Date();
    let endDate = null;

    if (selectedPlan.durationInMonths > 0) {
      endDate = new Date();
      endDate.setMonth(endDate.getMonth() + selectedPlan.durationInMonths);
    }

    user.Subscription = {
      planName: selectedPlan.name,
      status: "active",
      billingCycle: selectedPlan.billingCycle,
      startDate,
      endDate,
      paymentId: selectedPlan.pricing.amount === 0 ? null : "PENDING_PAYMENT",
    };

    // Send confirmation email
    await sendSubscriptionConfirmationEmail(
      user.Email,
      selectedPlan.name,
      startDate,
      endDate
    );
    await user.save();

    res.status(200).json({
      message: `Subscribed to ${selectedPlan.name} successfully`,
      subscription: user.Subscription,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
