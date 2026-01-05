const Property = require("../models/Property");
const Room = require("../models/Room");
const SendPropertyCreationEmail =
  require("../utils/sendEmail").SendPropertyCreationEmail;
const { deleteFromCloudinary } = require("../utils/cloudinaryHelper");

const { createRoomsForProperty } = require("../services/room.service");

const { logActivity } = require("../services/activity.service");

exports.addProperty = async (req, res) => {
  try {
    const ownerId = req.user?.id;

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { name, propertyType, totalRooms, location, floorConfig } = req.body;

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

    const images = [
      {
        url:
          req.body.imageUrl ||
          "https://res.cloudinary.com/de80xznxj/image/upload/v1766855795/default_Property_wazpgw.jpg",
        public_id: req.body.imagePublicId || "default_Property_wazpgw",
      },
    ];

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
      images,
    });

    // 🛏️ 2️⃣ Auto-create Rooms
    const Roomimages = [
      {
        url:
          req.body.imageUrl ||
          "https://res.cloudinary.com/de80xznxj/image/upload/v1766856271/default_rooms_gmuyyg.jpg",
        public_id: req.body.imagePublicId || "default_rooms_gmuyyg",
      },
    ];

    const rooms = await createRoomsForProperty({
      propertyId: newProperty._id,
      ownerId,
      totalRooms: Number(totalRooms),
      floorConfig,
      roomImages: Roomimages,
    });

    // 📝 3️⃣ Log Activity
    await logActivity({
      owner: ownerId,
      entityType: "PROPERTY",
      entityId: newProperty._id,
      action: "CREATED",
      message: `Property "${newProperty.name}" has been successfully created with ${rooms.length} rooms.`,
      meta: { totalRooms: rooms.length },
    });

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

exports.getPropertyById = async (req, res) => {
  try {
    const ownerId = req.user?.id;
    const { id: propertyId } = req.params;

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const property = await Property.findOne({
      _id: propertyId,
      owner: ownerId,
    }).lean();

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    return res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    console.error("Get Property By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const propertyId = req.params.id;

    const { name, propertyType, totalRooms, isActive, images } = req.body;

    const property = await Property.findOne({
      _id: propertyId,
      owner: ownerId,
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    const oldImage = property.images?.[0];
    const newImage = images?.[0];

    // 🔥 DELETE ONLY IF IMAGE ACTUALLY CHANGED
    if (
      newImage &&
      oldImage &&
      oldImage.public_id &&
      oldImage.public_id !== "default_Property_wazpgw" &&
      newImage.public_id !== oldImage.public_id
    ) {
      await deleteFromCloudinary(oldImage.public_id);
    }

    // 🔄 UPDATE FIELDS (SAFE)
    if (name) property.name = name;
    if (propertyType) property.propertyType = propertyType;
    if (totalRooms) property.totalRooms = totalRooms;
    if (typeof isActive === "boolean") property.isActive = isActive;
    if (images?.length) property.images = images;

    await property.save();

    // Record Activity
    await logActivity({
      owner: ownerId,
      entityType: "PROPERTY",
      entityId: property._id,
      action: "UPDATED",
      message: `Property "${property.name}" details were updated.`,
      meta: { updatedFields: Object.keys(req.body) },
    });

    // ✅ Response

    return res.status(200).json({
      success: true,
      message: "Property updated successfully",
    });
  } catch (error) {
    console.error("Update Property Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const propertyId = req.params.id;

    // 🔍 Find property
    const property = await Property.findOne({
      _id: propertyId,
      owner: ownerId,
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // 🔥 1️⃣ Delete all rooms of this property
    await Room.deleteMany({ property: propertyId });

    // 🔥 2️⃣ Delete property image from Cloudinary (if not default)
    const image = property.images?.[0];
    if (
      image &&
      image.public_id &&
      image.public_id !== "default_Property_wazpgw"
    ) {
      await deleteFromCloudinary(image.public_id);
    }

    // 📝 4️⃣ Log Activity
    await logActivity({
      owner: ownerId,
      entityType: "PROPERTY",
      entityId: propertyId,
      action: "DELETED",
      message: `Property "${property.name}" and all its rooms were deleted.`,
    });

    // 🔥 3️⃣ Delete property itself
    await Property.deleteOne({ _id: propertyId });

    return res.status(200).json({
      success: true,
      message: "Property and all its rooms deleted successfully",
    });
  } catch (error) {
    console.error("Delete Property Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
