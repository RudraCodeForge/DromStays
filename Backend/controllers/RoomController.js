const Room = require("../models/Room");

exports.getOwnerRooms = async (req, res) => {
  try {
    const ownerId = req.user?.id;
    const { propertyId } = req.query;

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const filter = { owner: ownerId };

    if (propertyId) {
      filter.property = propertyId;
    }

    const rooms = await Room.find(filter).lean();

    return res.status(200).json({
      success: true,
      rooms,
    });
  } catch (error) {
    console.error("Get Owner Rooms Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
