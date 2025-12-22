const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access token missing" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const user = await User.findById(decoded.id).select("-Password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 🔐 LOGOUT FROM ALL DEVICES CHECK
    if (decoded.tokenVersion !== user.tokenVersion) {
      return res.status(401).json({
        message: "Session expired. Please login again.",
      });
    }

    // 🔴 BLOCK CHECK
    if (user.isBlocked) {
      return res.status(403).json({
        message: "Your account has been blocked. Please contact support.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
