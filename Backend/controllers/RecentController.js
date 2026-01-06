const RecentActivity = require("../models/RecentActivity");

exports.getRecentActivities = async (req, res) => {
  try {
    const ownerId = req.user?.id;
    if (!ownerId) {
      return res.status(401).json({
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
