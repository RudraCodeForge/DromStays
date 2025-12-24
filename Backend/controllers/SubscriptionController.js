const User = require("../models/User");

const plans = [
  {
    name: "Basic",
    price: "₹199 / month",
    description: "Perfect for individuals getting started",
    features: [
      "Room listing access",
      "Basic support",
      "Limited service partners",
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: "₹499 / month",
    description: "Best for active users & tenants",
    features: [
      "Unlimited room access",
      "Priority support",
      "Tiffin, Cleaning & Electrician access",
      "Verified listings",
    ],
    popular: true,
  },
  {
    name: "Premium",
    price: "₹999 / month",
    description: "For owners & power users",
    features: [
      "Post unlimited rooms",
      "Featured listings",
      "Dedicated support",
      "All service partners access",
      "Early feature access",
    ],
    popular: false,
  },
];

exports.GET_SUBSCRIPTIONS = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("subscriptions");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ plans });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
