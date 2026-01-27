const Property = require("../models/Property");
const Room = require("../models/Room");
const SendPropertyCreationEmail = require("../utils/sendEmail").SendPropertyCreationEmail;
const User = require("../models/User");

const { deleteFromCloudinary } = require("../utils/cloudinaryHelper");

const { createRoomsForProperty } = require("../services/room.service");

const { logActivity } = require("../services/activity.service");


const mongoose = require("mongoose");
const Review = require("../models/Review");

// 🔒 INTERNAL helper (NO ROUTE)
const calculatePropertyRating = async (propertyId) => {
  const result = await Review.aggregate([
    {
      $match: {
        reviewType: "ROOM",
        // production me true rakho
        isApproved: false,
      },
    },
    {
      $lookup: {
        from: "rooms",
        localField: "referenceId", // roomId
        foreignField: "_id",
        as: "room",
      },
    },
    { $unwind: "$room" },
    {
      $match: {
        "room.property": new mongoose.Types.ObjectId(propertyId), // ✅ CORRECT
      },
    },
    {
      $group: {
        _id: "$room.property",
        avgRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  if (!result.length) {
    return { avgRating: 0, totalReviews: 0 };
  }

  return {
    avgRating: Number(result[0].avgRating.toFixed(1)),
    totalReviews: result[0].totalReviews,
  };
};




exports.addProperty = async (req, res) => {
  try {
    const ownerId = req.user?.id;

    const owner = await User.findById(ownerId);
    if (owner.Role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Only owners can add properties",
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
    const owner = await User.findById(ownerId);
    if (!owner.Role === "owner") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const properties = await Property.find({ owner: ownerId }).lean();
    const propertiesWithRating = await Promise.all(
      properties.map(async (property) => {
        const rating = await calculatePropertyRating(property._id);
        return {
          ...property,
          rating,
        };
      })
    );
    return res.status(200).json({
      success: true,
      properties: propertiesWithRating,
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

    const owner = await User.findById(ownerId);
    if (!owner.Role === "owner") {
      return res.status(403).json({
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
    const owner = await User.findById(ownerId);

    if (owner.Role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Only owners can update properties",
      });
    }

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
    const owner = await User.findById(ownerId);

    if (owner.Role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Only owners can delete properties",
      });
    }

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

exports.searchProperties = async (req, res) => {
  try {
    const {
      location,
      nearby,
      lat,
      lng,
      propertyType,
      radius, // 👈 NEW (km)
    } = req.query;

    let query = {
      isActive: true,
    };

    /* 📍 LOCATION SEARCH */
    if (location) {
      query.$or = [
        { "location.city": { $regex: location, $options: "i" } },
        { "location.area": { $regex: location, $options: "i" } },
      ];
    }

    /* 🏠 PROPERTY TYPE */
    if (propertyType) {
      query.propertyType = propertyType;
    }

    let properties = [];
    let message = "Properties fetched successfully";


    /* 📍 NEARBY SEARCH */
    if (nearby === "true" && lat && lng) {
      const radiusInKm = radius ? Number(radius) : 5; // default 5km
      const maxDistance = radiusInKm * 1000; // meters

      properties = await Property.find({
        ...query,
        "location.geo": {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(lng), Number(lat)],
            },
            $maxDistance: maxDistance,
          },
        },
      });

      if (properties.length === 0) {
        message = `No property found within ${radiusInKm} km`;
      }
    } else {
      /* 🔎 NORMAL SEARCH / ALL */
      properties = await Property.find(query);

      if (properties.length === 0) {
        message = "No properties matched your search criteria";
      }
    }

    // ⭐ Attach rating to each property
    properties = await Promise.all(
      properties.map(async (property) => {
        const rating = await calculatePropertyRating(property._id);
        return {
          ...property.toObject?.() || property,
          rating,
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: properties.length,
      message,
      properties,
    });
  } catch (error) {
    console.error("Search Properties Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
