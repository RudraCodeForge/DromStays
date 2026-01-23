const Property = require("../models/Property");
const Room = require("../models/Room");
const Request = require("../models/Requests");

exports.makeRequest = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      roomId,
      requestType,
      name,
      visitDate,
      visitTimeSlot,
      purposeOfVisit,
      message,
    } = req.body;

    if (
      !roomId ||
      !requestType ||
      !name ||
      !visitDate ||
      !visitTimeSlot ||
      !purposeOfVisit
    ) {
      return res
        .status(400)
        .json({ error: "All required fields must be filled" });
    }

    const todayDateStr = new Date().toISOString().split("T")[0];
    const selectedDateStr = new Date(visitDate).toISOString().split("T")[0];

    if (selectedDateStr < todayDateStr) {
      return res.status(400).json({
        error: "Past dates are not allowed",
      });
    }

    const slotEndHours = {
      "10 AM - 11 AM": 11,
      "12 PM - 1 PM": 13,
      "4 PM - 5 PM": 17,
      "6 PM - 7 PM": 19,
    };

    if (!slotEndHours[visitTimeSlot]) {
      return res.status(400).json({
        error: "Invalid time slot selected",
      });
    }

    if (selectedDateStr === todayDateStr) {
      const currentHour = new Date().getHours();

      if (slotEndHours[visitTimeSlot] <= currentHour) {
        return res.status(400).json({
          error: "Selected time slot has already passed",
        });
      }
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    const property = await Property.findById(room.property);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    const newRequest = new Request({
      requestType,
      roomId,
      userId,
      userName: name,
      ownerId: room.owner,
      propertyName: property.name,
      roomNo: room.roomNumber,
      visitDate,
      visitTimeSlot,
      purposeOfVisit,
      message,
    });

    await newRequest.save();

    res.status(201).json({
      message: "Room visit request created successfully",
      request: newRequest,
    });
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({ error: "Server error" });
  }
};
