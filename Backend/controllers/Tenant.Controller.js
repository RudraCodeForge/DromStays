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

    /* 🚫 CAPACITY CHECK (HARD GUARD) */
    if (room.tenants.length >= room.capacity) {
      return res.status(400).json({
        success: false,
        message: "Room is already full",
      });
    }

    /* 🔍 FIND TENANT (ACTIVE OR INACTIVE) */
    let tenant = await Tenant.findOne({
      phone,
      property: room.property,
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
        isActive: true,
      });
    } else {
      /* 🔁 EXISTING TENANT (RE-ACTIVATE IF NEEDED) */
      if (!tenant.isActive) {
        tenant.isActive = true;
      }

      // update basic details (safe overwrite)
      tenant.fullName = fullName;
      tenant.email = email;

      // add room if not already linked
      if (!tenant.rooms.includes(room._id)) {
        tenant.rooms.push(room._id);
      }

      await tenant.save();
    }

    /* 🏠 ADD TENANT TO ROOM (SAFE PUSH) */
    if (!room.tenants.includes(tenant._id)) {
      room.tenants.push(tenant._id);
      await room.save(); // 🔑 triggers pre("save") → availability sync
    }

    return res.status(201).json({
      success: true,
      message: "Tenant added to room successfully",
      tenant,
    });
  } catch (error) {
    console.error("ADD TENANT ERROR:", error);

    // 🔒 Duplicate index error (if unique index exists)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Tenant with same phone already exists for this property",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.DELETE_TENANT_BY_ID = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const ownerId = req.user.id;

    /* 👤 TENANT CHECK */
    const tenant = await Tenant.findOne({ _id: tenantId, owner: ownerId });
    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
    }

    // soft delete
    tenant.isActive = false;
    await tenant.save();

    /* 🏠 FIND ALL ROOMS WHERE TENANT EXISTS */
    const rooms = await Room.find({ tenants: tenant._id });

    for (const room of rooms) {
      room.tenants.pull(tenant._id);

      // 🔑 recompute availability
      room.isAvailable = room.tenants.length < room.capacity;

      await room.save(); // ✅ pre("save") runs
    }

    return res.status(200).json({
      success: true,
      message: "Tenant deleted successfully",
    });
  } catch (error) {
    console.error("DELETE TENANT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.GET_TENANTS_BY_ROOM_ID = async (req, res) => {
  try {
    const { roomId } = req.params;
    const ownerId = req.user.id;
    /* 🏠 ROOM CHECK */
    const room = await Room.findOne({ _id: roomId, owner: ownerId }).populate(
      "tenants"
    );
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }
    return res.status(200).json({
      success: true,
      tenants: room.tenants,
    });
  } catch (error) {
    console.error("GET TENANTS BY ROOM ID ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
