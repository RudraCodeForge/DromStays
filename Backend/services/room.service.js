const Room = require("../models/Room");

exports.createRoomsForProperty = async ({
  propertyId,
  ownerId,
  totalRooms,
  floorConfig,
  roomImages,
}) => {
  const rooms = [];

  if (Array.isArray(floorConfig) && floorConfig.length > 0) {
    for (const f of floorConfig) {
      for (let i = 1; i <= f.rooms; i++) {
        rooms.push({
          property: propertyId,
          owner: ownerId,
          roomNumber: String(f.floor * 100 + i),
          floor: f.floor,
          capacity: 1,
          roomType: "Single",
          pricing: { billingType: "monthly" },
          amenities: [],
          isAvailable: true,
          images: roomImages,
        });
      }
    }
  } else {
    for (let i = 1; i <= totalRooms; i++) {
      rooms.push({
        property: propertyId,
        owner: ownerId,
        roomNumber: `R-${i}`,
        floor: 0,
        capacity: 1,
        roomType: "Single",
        pricing: { billingType: "monthly" },
        amenities: [],
        isAvailable: true,
        images: roomImages,
      });
    }
  }

  await Room.insertMany(rooms);

  return rooms; // ✅ ARRAY return karo
};
