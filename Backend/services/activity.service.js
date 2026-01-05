const RecentActivity = require("../models/RecentActivity");

exports.logActivity = async ({
  owner,
  entityType,
  entityId,
  action,
  message,
  meta = {},
}) => {
  try {
    await RecentActivity.create({
      owner,
      entityType,
      entityId,
      action,
      message,
      meta,
    });
  } catch (error) {
    console.error("Activity Log Error:", error.message);
  }
};
