const RecentActivity = require("../models/RecentActivity");
const User = require("../models/User");
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
    console.error("Get Recent Activities Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
