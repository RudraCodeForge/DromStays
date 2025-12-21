const express = require("express");
const UserRouter = express.Router();
const UserController = require("../controllers/UserController");
const authMiddleware = require("../middlewares/authMiddleware");

UserRouter.put(
  "/profile",
  authMiddleware, // ✅ logged-in user
  UserController.UPDATE_PROFILE
);

module.exports = UserRouter;
