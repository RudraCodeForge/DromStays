const User = require("../models/User");

const plans = [
  // =========================
  // 🧑‍🎓 BASIC (TENANT – FREE)
  // =========================
  {
    name: "Basic",
    description: "Best for tenants looking for rooms without any charges",
    role: "tenant",
    billingCycle: "free",
    durationInMonths: 0,
    pricing: {
      amount: 0, // paise
      currency: "INR",
      displayPrice: "Free",
    },
    features: [
      "Browse available rooms",
      "Contact owners directly",
      "No broker or hidden charges",
      "Access basic service partners",
    ],
    popular: true,
  },

  // =========================
  // 🆓 STARTER (OWNER – FREE)
  // =========================
  {
    name: "Starter",
    description: "Try Dormstays and get your first tenant leads",
    role: "owner",
    billingCycle: "free",
    durationInMonths: 0,
    pricing: {
      amount: 0,
      currency: "INR",
      displayPrice: "Free",
    },
    limits: {
      maxRoomListings: 1,
      maxLeadsPerMonth: 5,
    },
    features: [
      "Post 1 room listing",
      "Get up to 5 tenant leads",
      "Basic visibility in search",
      "Manage listing from dashboard",
      "Upgrade anytime for more leads",
    ],
    popular: false,
  },

  // =========================
  // 🏠 PRO (OWNER – MONTHLY)
  // =========================
  {
    name: "Pro",
    description: "Flexible monthly plan for room owners",
    role: "owner",
    billingCycle: "monthly",
    durationInMonths: 1,
    pricing: {
      amount: 49900, // ₹499
      currency: "INR",
      displayPrice: "₹499 / month",
    },
    features: [
      "Post up to 5 room listings",
      "Unlimited tenant leads",
      "Verified owner badge",
      "Service partner access",
      "Standard support",
    ],
    popular: false,
  },

  // =========================
  // 🏠 PRO PLUS (OWNER – QUARTERLY)
  // =========================
  {
    name: "Pro Plus",
    description: "Save more with quarterly billing",
    role: "owner",
    billingCycle: "quarterly",
    durationInMonths: 3,
    pricing: {
      amount: 139900, // ₹1399
      currency: "INR",
      displayPrice: "₹1,399 / 3 months",
    },
    features: [
      "Post up to 10 room listings",
      "Higher visibility than monthly",
      "Unlimited tenant leads",
      "Verified owner badge",
      "Priority support",
    ],
    popular: true,
  },

  // =========================
  // 🏠 PREMIUM (OWNER – YEARLY)
  // =========================
  {
    name: "Premium",
    description: "Maximum visibility & best value for serious owners",
    role: "owner",
    billingCycle: "yearly",
    durationInMonths: 12,
    pricing: {
      amount: 499900, // ₹4999
      currency: "INR",
      displayPrice: "₹4,999 / year",
    },
    features: [
      "Unlimited room listings",
      "Top & featured placements",
      "Highest tenant visibility",
      "Verified & trusted owner badge",
      "Dedicated priority support",
      "Early access to new features",
    ],
    popular: false,
  },
];

exports.GET_SUBSCRIPTIONS = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("Role");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const filteredPlans = plans.filter((plan) => plan.role === user.Role);

    res.status(200).json({ plans: filteredPlans });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    res.status(500).json({ message: "Server Error" });
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

    await user.save();

    res.status(200).json({
      message: `Subscribed to ${selectedPlan.name} successfully`,
      subscription: user.Subscription,
    });
  } catch (error) {
    console.error("Error subscribing to plan:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
