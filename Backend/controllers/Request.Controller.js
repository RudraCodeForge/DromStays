const Property = require("../models/Property");
const Room = require("../models/Room");
const Request = require("../models/Requests");
const User = require("../models/User");
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
      propertyId: property._id,
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
    res.status(500).json({ error: "Server error" });
  }
};

exports.Get_Requests = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.Role;

    let filter = {};

    if (role === "tenant") {
      filter.userId = userId;
    } else if (role === "owner") {
      filter.ownerId = userId;
    } else {
      return res.status(403).json({
        success: false,
        message: "Unauthorized role",
      });
    }

    const requests = await Request.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch requests",
      error: error.message,
    });
  }
};

exports.Respond_To_Request = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const owner = await User.findById(ownerId);

    if (owner.Role !== "owner") {
      return res.status(403).json({
        error: "Only owners can respond to requests",
      });
    }

    const { requestId, status, ownerResponse } = req.body;

    // 🔹 Basic validation
    if (!requestId || !status) {
      return res.status(400).json({
        error: "Request ID and status are required",
      });
    }

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        error: "Invalid status value",
      });
    }

    if (!ownerResponse || !ownerResponse.trim()) {
      return res.status(400).json({
        error: "Owner response is required",
      });
    }

    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({
        error: "Request not found",
      });
    }

    // 🔹 Owner authorization check
    if (request.ownerId.toString() !== ownerId) {
      return res.status(403).json({
        error: "Unauthorized action",
      });
    }

    // 🔹 Prevent double action
    if (request.status !== "pending") {
      return res.status(400).json({
        error: "Request already processed",
      });
    }

    // 🔥 Update request
    request.status = status;
    request.ownerResponse = ownerResponse;

    // 🔥 TTL: Auto delete after 24 hours
    request.deleteAfter = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    );

    await request.save();

    res.status(200).json({
      message: `Request ${status} successfully`,
      request,
    });
  } catch (error) {
    res.status(500).json({
      error: "Server error",
    });
  }
};

exports.Mark_Completed = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const role = user.Role;
    const { requestId } = req.body;

    if (!requestId) {
      return res.status(400).json({ error: "Request ID is required" });
    }

    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    // 🔹 OWNER FLOW
    if (role === "owner") {
      if (request.ownerId.toString() !== userId) {
        return res.status(403).json({ error: "Unauthorized action" });
      }

      if (request.status !== "approved") {
        return res
          .status(400)
          .json({ error: "Only approved requests can be completed" });
      }

      if (request.isCompleted) {
        return res
          .status(400)
          .json({ error: "Request already marked as completed" });
      }

      request.isCompleted = true;
      await request.save();

      return res.status(200).json({
        message: "Request marked as completed by owner",
        request,
      });
    }

    // 🔹 TENANT FLOW
    if (role === "tenant") {
      if (request.userId.toString() !== userId) {
        return res.status(403).json({ error: "Unauthorized action" });
      }

      if (!request.isCompleted) {
        return res.status(400).json({
          error: "Request is not yet completed by owner",
        });
      }

      if (request.reviewEligible) {
        return res.status(400).json({
          error: "Review already enabled for this request",
        });
      }

      request.reviewEligible = true;
      await request.save();

      return res.status(200).json({
        message: "Request marked as review eligible",
        request,
      });
    }

    return res.status(403).json({ error: "Unauthorized role" });
  } catch (error) {
    console.error("Error marking request as completed:", error);
    res.status(500).json({ error: "Server error" });
  }
};
