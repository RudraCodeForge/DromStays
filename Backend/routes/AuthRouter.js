const express = require("express");
const AuthRouter = express.Router();
const AuthController = require("../controllers/AuthController");
const authMiddleware = require("../middlewares/authMiddleware");

AuthRouter.post("/signup", AuthController.POSTSIGNUP);
AuthRouter.post("/login", AuthController.POSTLOGIN);

AuthRouter.post(
  "/send-verification",
  authMiddleware, // ✅ logged-in user
  AuthController.SEND_VERIFICATION_EMAIL
);

AuthRouter.post(
  "/verify",
  AuthController.POSTVERIFYACCOUNT // ❌ NO authMiddleware
);
AuthRouter.get("/me", authMiddleware, AuthController.GET_ME);

module.exports = AuthRouter;
