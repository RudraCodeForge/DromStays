const Session = require("../models/Session");

// Get all active sessions for the logged-in user
exports.getActiveSessions = async (req, res) => {
    try {
        const userId = req.user._id;
        const currentToken = req.cookies.refreshToken;

        const sessions = await Session.find({ userId }).sort({
            createdAt: -1,
        });

        const formatted = sessions.map((s) => ({
            ...s.toObject(),
            isCurrent: s.refreshToken === currentToken,
        }));

        res.status(200).json(formatted);
    } catch (error) {
        res.status(500).json({ message: "Error fetching active sessions" });
    }
};

exports.logoutSession = async (req, res) => {
    const { sessionId } = req.params;

    try {
        const session = await Session.findOne({
            _id: sessionId,
            userId: req.user._id,
        });

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        // 🔥 Agar current device ka session hai
        if (session.refreshToken === req.cookies.refreshToken) {
            res.clearCookie("refreshToken");
        }

        await Session.deleteOne({ _id: sessionId });

        res.status(200).json({
            message: "Logged out from session successfully",
            isCurrent: session.refreshToken === req.cookies.refreshToken,
        });
    } catch (error) {
        res.status(500).json({ message: "Error logging out from session" });
    }
};

// Logout from all sessions
exports.logoutAllSessions = async (req, res) => {
    try {
        await Session.deleteMany({ userId: req.user._id });
        res.status(200).json({ message: "Logged out from all sessions successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error logging out from all sessions" });
    }
};