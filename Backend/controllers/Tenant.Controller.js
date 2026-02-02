const Tenant = require("../models/Tenant");
const Room = require("../models/Room");
const User = require("../models/User");
const Property = require("../models/Property");
const Payment = require("../models/Payment");
const RoomBooking = require("../models/RoomBooking");
const { logActivity } = require("../services/activity.service");
const createInvoiceWithPDF = require("../utils/createInvoiceWithPDF");
const generateAgreementPDF = require("../utils/generateAgreementPDF");

exports.ADD_TENANT_TO_ROOM = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      email,
      joiningDate,
      roomId,
      advanceAmount,
    } = req.body;

    const ownerId = req.user.id;

    /* 🔐 OWNER CHECK */
    const owner = await User.findById(ownerId);
    if (!owner || owner.Role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    /* 🧾 BASIC VALIDATION */
    if (!fullName || !phone || !roomId) {
      return res.status(400).json({
        success: false,
        message: "Full name, phone and room are required",
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

    /* 🏢 PROPERTY + OWNER VALIDATION */
    const property = await Property.findById(room.property);
    if (!property || property.owner.toString() !== ownerId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized property access",
      });
    }

    /* 🚫 ROOM CAPACITY CHECK */
    if (room.tenants.length >= room.capacity) {
      return res.status(400).json({
        success: false,
        message: "Room capacity full",
      });
    }

    /* 👤 FIND OR CREATE TENANT */
    let tenant = await Tenant.findOne({
      phone,
      property: room.property,
    });

    if (!tenant) {
      const user = email
        ? await User.findOne({ Email: email })
        : null;

      tenant = await Tenant.create({
        fullName: user ? user.Name : fullName,
        phone: user ? user.Phone : phone,
        email,
        user: user ? user._id : null,
        isRegistered: !!user,
        joinedAt: joiningDate || new Date(),
        rooms: [room._id],
        property: room.property,
        owner: ownerId,
        isActive: true,
      });
    } else {
      tenant.fullName = fullName;
      tenant.email = email;
      tenant.isActive = true;

      if (!tenant.rooms.includes(room._id)) {
        tenant.rooms.push(room._id);
      }

      await tenant.save();
    }

    /* 🧮 RENT CALCULATION */
    const tenantCount = room.tenants.length + 1;
    const pricing = room.pricing;

    let rentAmount;
    let billingType;

    if (pricing.billingType === "monthly") {
      billingType = "monthly";
      rentAmount =
        tenantCount > 1
          ? pricing.sharing.perPersonMonthlyRent
          : pricing.singleOccupancy.monthlyRent;
    } else {
      billingType = "daily";
      rentAmount =
        tenantCount > 1
          ? pricing.sharing.perPersonDailyRent
          : pricing.singleOccupancy.dailyRent;
    }

    if (!rentAmount) {
      return res.status(400).json({
        success: false,
        message: "Room pricing not configured properly",
      });
    }

    const bookingDate = joiningDate ? new Date(joiningDate) : new Date();

    /* 📘 ROOM BOOKING */
    const roomBooking = await RoomBooking.create({
      room: room._id,
      tenant: tenant._id,
      owner: ownerId,
      billingType,
      bookingDate,
      billingCycleDay:
        billingType === "monthly" ? bookingDate.getDate() : null,
      rentAmount,
      advanceAmount: Number(advanceAmount) || 0,
      nextDueDate: bookingDate,
      totalDue: rentAmount,
      status: "active",
    });

    /* 🔁 UPDATE EXISTING TENANT RENT IF SHARING STARTS */
    if (room.tenants.length === 1) {
      // sharing price calculate
      const sharedRent =
        pricing.billingType === "monthly"
          ? pricing.sharing.perPersonMonthlyRent
          : pricing.sharing.perPersonDailyRent;

      if (!sharedRent) {
        return res.status(400).json({
          success: false,
          message: "Sharing price not configured",
        });
      }

      const existingTenantId = room.tenants[0];

      /* 🧾 UPDATE ROOM BOOKING */
      await RoomBooking.updateOne(
        {
          room: room._id,
          tenant: existingTenantId,
          status: "active",
        },
        {
          $set: {
            rentAmount: sharedRent,
            totalDue: sharedRent,
          },
        }
      );

      /* 💰 UPDATE PENDING RENT PAYMENT */
      await Payment.updateOne(
        {
          tenant: existingTenantId,
          room: room._id,
          type: "RENT",
          status: "PENDING",
        },
        {
          $set: {
            amount: sharedRent,
          },
        }
      );
    }

    /* 📄 UPDATE EXISTING TENANT AGREEMENT IF SHARING STARTS */
    if (room.tenants.length === 1) {
      const sharedRent =
        pricing.billingType === "monthly"
          ? pricing.sharing.perPersonMonthlyRent
          : pricing.sharing.perPersonDailyRent;

      const existingTenantId = room.tenants[0];

      const existingBooking = await RoomBooking.findOne({
        room: room._id,
        tenant: existingTenantId,
        status: "active",
      }).populate("tenant");

      if (existingBooking) {
        /* 🔁 UPDATE RENT */
        existingBooking.rentAmount = sharedRent;
        existingBooking.totalDue = sharedRent;
        await existingBooking.save();

        /* 📄 REGENERATE AGREEMENT */
        const newAgreementPath = await generateAgreementPDF({
          bookingId: existingBooking._id,
          owner,
          tenant: existingBooking.tenant,
          room,
          property,
          rentAmount: sharedRent,
          advanceAmount: existingBooking.advanceAmount || 0,
          bookingDate: existingBooking.bookingDate,
        });

        existingBooking.agreementPdf = newAgreementPath;
        existingBooking.agreementGeneratedAt = new Date();
        await existingBooking.save();
      }

      /* 💰 UPDATE PENDING RENT PAYMENT */
      await Payment.updateOne(
        {
          tenant: existingTenantId,
          room: room._id,
          type: "RENT",
          status: "PENDING",
        },
        {
          $set: { amount: sharedRent },
        }
      );
    }


    /* 🔗 ADD TENANT TO ROOM */
    room.tenants.push(tenant._id);
    await room.save();

    /* 💰 ADVANCE PAYMENT */
    if (advanceAmount && Number(advanceAmount) > 0) {
      const advancePayment = await Payment.create({
        tenant: tenant._id,
        room: room._id,
        property: room.property,
        owner: ownerId,
        type: "ADVANCE",
        amount: Number(advanceAmount),
        status: "PAID",
        paidAt: new Date(),
      });

      await createInvoiceWithPDF({
        tenant: tenant._id,
        owner: ownerId,
        property,
        room,
        payment: advancePayment,
        type: "Advance",
        amount: Number(advanceAmount),
        status: "PAID",
      });
    }

    /* 🧾 RENT PAYMENT (PENDING) */
    const rentPayment = await Payment.create({
      tenant: tenant._id,
      room: room._id,
      property: room.property,
      owner: ownerId,
      type: "RENT",
      amount: rentAmount,
      month: new Date().toISOString().slice(0, 7),
      status: "PENDING",
      dueDate: bookingDate,
    });

    await createInvoiceWithPDF({
      tenant: tenant._id,
      owner: ownerId,
      property,
      room,
      payment: rentPayment,
      type: "Rent",
      amount: rentAmount,
      status: "PENDING",
    });

    const agreementPath = await generateAgreementPDF({
      bookingId: roomBooking._id,
      owner,
      tenant,
      room,
      property,
      rentAmount,
      advanceAmount,
      bookingDate,
    });

    roomBooking.agreementPdf = agreementPath;
    roomBooking.agreementGeneratedAt = new Date();
    await roomBooking.save();

    /* 🧠 ACTIVITY LOG */
    await logActivity({
      owner: ownerId,
      entityType: "ROOM",
      entityId: room._id,
      action: "BOOKED",
      message: `Tenant "${tenant.fullName}" added to room ${room.roomNumber} (${property.name})`,
      meta: {
        tenantId: tenant._id,
        roomId: room._id,
        propertyId: property._id,
      },
    });

    /* ✅ FINAL RESPONSE */
    return res.status(201).json({
      success: true,
      message: "Tenant added successfully",
      tenant,
      roomBooking,
    });
  } catch (error) {
    console.error("ADD_TENANT_TO_ROOM ERROR:", error);
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

    const owner = await User.findById(ownerId);
    const role = owner.Role;
    if (role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    /* 👤 TENANT CHECK */
    const tenant = await Tenant.findOne({ _id: tenantId, owner: ownerId });
    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
    }

    // 🔒 Soft delete tenant
    tenant.isActive = false;
    tenant.rooms = []; // clean references
    await tenant.save();

    /* 🏠 FIND ALL ROOMS WHERE TENANT EXISTS */
    const rooms = await Room.find({ tenants: tenant._id });

    for (const room of rooms) {
      // remove tenant from room
      room.tenants.pull(tenant._id);
      room.isAvailable = room.tenants.length < room.capacity;
      await room.save();

      const property = await Property.findById(room.property);

      // 📝 ACTIVITY LOG (PER ROOM)
      await logActivity({
        owner: ownerId,
        entityType: "ROOM",
        entityId: tenant._id,
        action: "DELETED",
        message: `Tenant "${tenant.fullName}" was removed from room "${room.roomNumber}" of property "${property?.name}"`,
        meta: {
          tenantId: tenant._id,
          roomId: room._id,
          propertyId: room.property,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tenant deleted successfully",
    });
  } catch (error) {
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
    const owner = await User.findById(ownerId);
    const role = owner.Role;
    if (role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }
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
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.GET_TENANT_COUNT = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // 🔐 Role check directly from token (faster & safe)
    if (req.user.Role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // ✅ Only ACTIVE tenants count
    const tenantCount = await Tenant.countDocuments({
      owner: ownerId,
      isActive: true,
    });

    return res.status(200).json({
      success: true,
      count: tenantCount,
    });
  } catch (error) {
    console.error("Error fetching tenant count:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
