const express = require("express");
const RoomRouter = express.Router();
const RoomController = require("../controllers/RoomController");
const authMiddleware = require("../middlewares/authMiddleware");

RoomRouter.get("/owner_rooms", authMiddleware, RoomController.getOwnerRooms);
RoomRouter.get("/:roomId", authMiddleware, RoomController.getRoomById);
RoomRouter.put("/:roomId", authMiddleware, RoomController.updateRoomById);

module.exports = RoomRouter;
