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

exports.getRoomById = async (req, res) => {
  try {
    const ownerId = req.user?.id;
    const { roomId } = req.params;

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    let room = await Room.findOne({
      _id: roomId,
      owner: ownerId,
    }).lean();

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    /* ✅ PRICING NORMALIZATION (MOST IMPORTANT PART) */
    room.pricing = {
      billingType: room.pricing?.billingType || "monthly",

      singleOccupancy: {
        dailyRent: room.pricing?.singleOccupancy?.dailyRent ?? 0,
        monthlyRent: room.pricing?.singleOccupancy?.monthlyRent ?? 0,
      },

      sharing: {
        perPersonDailyRent: room.pricing?.sharing?.perPersonDailyRent ?? 0,
        perPersonMonthlyRent: room.pricing?.sharing?.perPersonMonthlyRent ?? 0,
      },
    };

    return res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    console.error("Get Room By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.updateRoomById = async (req, res) => {
  try {
    const ownerId = req.user?.id;
    const { roomId } = req.params;

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const room = await Room.findOne({
      _id: roomId,
      owner: ownerId,
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    const {
      roomNumber,
      roomType,
      capacity,
      floor,
      status,
      amenities,
      rules,
      pricing,
    } = req.body;

    /* ✅ SAFE UPDATES */
    if (roomNumber !== undefined) room.roomNumber = roomNumber;
    if (roomType !== undefined) room.roomType = roomType;
    if (capacity !== undefined) room.capacity = capacity;
    if (floor !== undefined) room.floor = floor;
    if (status !== undefined) room.status = status;
    if (Array.isArray(amenities)) room.amenities = amenities;
    if (Array.isArray(rules)) room.rules = rules;

    if (pricing) {
      room.pricing.billingType =
        pricing.billingType || room.pricing.billingType;

      room.pricing.singleOccupancy = {
        dailyRent: pricing.singleOccupancy?.dailyRent ?? 0,
        monthlyRent: pricing.singleOccupancy?.monthlyRent ?? 0,
      };

      room.pricing.sharing = {
        perPersonDailyRent: pricing.sharing?.perPersonDailyRent ?? 0,
        perPersonMonthlyRent: pricing.sharing?.perPersonMonthlyRent ?? 0,
      };
    }

    await room.save(); // pre-save runs safely

    return res.status(200).json({
      success: true,
      message: "Room updated successfully",
      room,
    });
  } catch (error) {
    console.error("Update Room By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
