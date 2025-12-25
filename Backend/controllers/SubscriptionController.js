const User = require("../models/User");

const plans = [
  // =========================
  // 🧑‍🎓 BASIC (TENANT – FREE)
  // =========================
  {
    name: "Basic",
    price: "₹0",
    description: "Best for tenants looking for rooms without any charges",
    role: "tenant",
    billingCycle: "free",
    durationInMonths: 0,
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
    price: "₹0",
    description: "Try Dormstays and get your first tenant leads",
    role: "owner",
    billingCycle: "free",
    durationInMonths: 0,
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
    price: "₹499 / month",
    description: "Flexible monthly plan for room owners",
    role: "owner",
    billingCycle: "monthly",
    durationInMonths: 1,
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
    price: "₹1,399 / 3 months",
    description: "Save more with quarterly billing",
    role: "owner",
    billingCycle: "quarterly",
    durationInMonths: 3,
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
    price: "₹4,999 / year",
    description: "Maximum visibility & best value for serious owners",
    role: "owner",
    billingCycle: "yearly",
    durationInMonths: 12,
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
    const userId = req.user.id;

    const user = await User.findById(userId).select("Role");

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
