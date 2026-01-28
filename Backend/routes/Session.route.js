const express = require("express");
const SessionRouter = express.Router();
const SessionController = require("../controllers/Session.Controller");
const authMiddleware = require("../middlewares/authMiddleware");

// Get all active sessions for the logged-in user
SessionRouter.get(
    "/active",
    authMiddleware,
    SessionController.getActiveSessions
);
// Logout from a specific session
SessionRouter.delete(
    "/logout-session/:sessionId",
    authMiddleware,
    SessionController.logoutSession
);
// Logout from all sessions
SessionRouter.delete(
    "/logout-all-sessions",
    authMiddleware,
    SessionController.logoutAllSessions
);

module.exports = SessionRouter;