const jwt = require("jsonwebtoken");

exports.generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.Role,
      tokenVersion: user.tokenVersion, // 🔥 ADD THIS
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "3d" }
  );
};

exports.generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      tokenVersion: user.tokenVersion, // 🔥 ADD THIS
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};
