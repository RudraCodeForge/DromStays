const express = require("express");
const RoomRouter = express.Router();
const RoomController = require("../controllers/Room.Controller");
const authMiddleware = require("../middlewares/authMiddleware");

// 🔐 OWNER ROUTES
RoomRouter.get("/owner_rooms", authMiddleware, RoomController.getOwnerRooms);

// 🌍 PUBLIC – PROPERTY ROOMS (AVAILABLE ONLY)
RoomRouter.get(
  "/property/:propertyId/rooms",
  RoomController.getPublicPropertyRooms
);

// 🌍 PUBLIC – ROOM DETAILS
RoomRouter.get("/:roomId", RoomController.getRoomById);

// 🔐 OWNER – UPDATE ROOM
RoomRouter.put("/:roomId", authMiddleware, RoomController.updateRoomById);

module.exports = RoomRouter;
