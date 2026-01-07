const express = require("express");
const UserRouter = express.Router();
const UserController = require("../controllers/User.Controller");
const authMiddleware = require("../middlewares/authMiddleware");

UserRouter.put(
  "/profile",
  authMiddleware, // ✅ logged-in user
  UserController.UPDATE_PROFILE
);

UserRouter.put(
  "/profilePicture",
  authMiddleware, // ✅ logged-in user
  UserController.UPDATE_PROFILE_PICTURE
);

module.exports = UserRouter;
