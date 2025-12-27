const Property = require("../models/Property");
const Room = require("../models/Room");
const SendPropertyCreationEmail =
  require("../utils/sendEmail").SendPropertyCreationEmail;

exports.addProperty = async (req, res) => {
  try {
    const ownerId = req.user?.id;

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { name, propertyType, totalRooms, location } = req.body;

    // 🔍 Validation
    if (
      !name?.trim() ||
      !propertyType ||
      !totalRooms ||
      !location ||
      !location.city?.trim() ||
      !location.area?.trim() ||
      !location.address?.trim() ||
      !location.geo ||
      !Array.isArray(location.geo.coordinates) ||
      location.geo.coordinates.length !== 2
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const [lng, lat] = location.geo.coordinates;

    // 📍 Coordinate validation (Earth-level only)
    if (
      typeof lng !== "number" ||
      typeof lat !== "number" ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid latitude or longitude",
      });
    }

    // 🏠 1️⃣ Create Property
    const newProperty = await Property.create({
      name: name.trim(),
      propertyType,
      totalRooms: Number(totalRooms),
      location: {
        city: location.city.trim(),
        area: location.area.trim(),
        address: location.address.trim(),
        geo: {
          type: "Point",
          coordinates: [lng, lat],
        },
      },
      owner: ownerId,
    });

    // 🛏️ 2️⃣ Auto-create Rooms
    const rooms = [];

    for (let i = 1; i <= Number(totalRooms); i++) {
      rooms.push({
        property: newProperty._id,
        owner: ownerId,
        roomNumber: `R-${i}`, // default room numbers
        floor: 0,
        capacity: 1,
        roomType: "Single",
        pricing: {
          billingType: "monthly",
        },
        amenities: [],
        isAvailable: true,
      });
    }

    await Room.insertMany(rooms);
    // 📧 3️⃣ Send Notification Email to Owner
    await SendPropertyCreationEmail(req.user.Email, newProperty.name);

    // ✅ Response
    return res.status(201).json({
      success: true,
      message: "Property and rooms created successfully",
      propertyId: newProperty._id,
      roomsCreated: rooms.length,
    });
  } catch (error) {
    console.error("Add Property Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getOwnerProperties = async (req, res) => {
  try {
    const ownerId = req.user?.id;
    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const properties = await Property.find({ owner: ownerId }).lean();
    return res.status(200).json({
      success: true,
      properties,
    });
  } catch (error) {
    console.error("Get Owner Properties Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
