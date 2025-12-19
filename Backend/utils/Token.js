const jwt = require("jsonwebtoken");

exports.generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id, // 🔥 ONLY THIS
      role: user.Role,
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "3d" }
  );
};

exports.generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(), // 🔥 SAME KEY
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};
