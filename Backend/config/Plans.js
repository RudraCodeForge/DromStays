module.exports = [
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
