const Tenant = require("../models/Tenant");
const Room = require("../models/Room");
const User = require("../models/User");

exports.ADD_TENANT_TO_ROOM = async (req, res) => {
  try {
    const { fullName, phone, email, joiningDate, roomId } = req.body;
    const ownerId = req.user.id;

    /* 🔴 BASIC VALIDATION */
    if (!fullName || !phone || !roomId) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    /* 👤 OWNER CHECK */
    const owner = await User.findById(ownerId);
    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Owner not found",
      });
    }

    // ❌ Owner cannot be tenant
    if (owner.Phone === phone || (email && owner.Email === email)) {
      return res.status(400).json({
        success: false,
        message: "Tenant details cannot be same as owner details",
      });
    }

    /* 🏠 ROOM CHECK */
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    /* 🚫 CAPACITY CHECK */
    if (room.tenants.length >= room.capacity) {
      return res.status(400).json({
        success: false,
        message: "Room is already full",
      });
    }

    /* 🔍 CHECK EXISTING TENANT (phone + property) */
    let tenant = await Tenant.findOne({
      phone,
      property: room.property,
      isActive: true,
    });

    if (!tenant) {
      /* 🆕 CREATE NEW TENANT */
      tenant = await Tenant.create({
        fullName,
        phone,
        email,
        joinedAt: joiningDate || Date.now(),
        rooms: [room._id],
        property: room.property,
        owner: ownerId,
      });
    } else {
      /* 🔁 EXISTING TENANT → ADD NEW ROOM */
      if (!tenant.rooms.includes(room._id)) {
        tenant.rooms.push(room._id);
        await tenant.save();
      }
    }

    /* 🏠 ADD TENANT TO ROOM (SAFE PUSH) */
    if (!room.tenants.includes(tenant._id)) {
      room.tenants.push(tenant._id);
      await room.save(); // auto availability update
    }

    return res.status(201).json({
      success: true,
      message: "Tenant added to room successfully",
      tenant,
    });
  } catch (error) {
    console.error("ADD TENANT ERROR:", error);

    // 🔒 Duplicate index error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Tenant with same phone or email already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
