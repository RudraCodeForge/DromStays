const RecentActivity = require("../models/RecentActivity");
const User = require("../models/User");
const LoginActivity = require("../models/LoginActivity");
exports.getRecentActivities = async (req, res) => {
  try {
    const ownerId = req.user?.id;
    const owner = await User.findById(ownerId);
    if (owner.Role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const activities = await RecentActivity.find({ owner: ownerId })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
    return res.status(200).json({
      success: true,
      activities,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.GET_LOGIN_ACTIVITY = async (req, res) => {
  const activity = await LoginActivity.find({
    userId: req.user.id,
  })
    .sort({ createdAt: -1 })
    .limit(10);

  res.json(activity);
};

