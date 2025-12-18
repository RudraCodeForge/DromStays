const jwt = require("jsonwebtoken");

exports.generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.Role,
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "3d" }
  );
};

exports.generateRefreshToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};
