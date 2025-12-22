const express = require("express");
const AuthRouter = express.Router();
const AuthController = require("../controllers/AuthController");
const authMiddleware = require("../middlewares/authMiddleware");

AuthRouter.post("/signup", AuthController.POSTSIGNUP);
AuthRouter.post("/login", AuthController.POSTLOGIN);
AuthRouter.post("/forget-password", AuthController.POSTFORGETPASSWORD);
AuthRouter.post("/reset-password", AuthController.POSTRESETPASSWORD);

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

AuthRouter.post(
  "/change-password",
  authMiddleware, // ✅ logged-in user
  AuthController.UPDATE_PASSWORD
);

module.exports = AuthRouter;
