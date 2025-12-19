const bcrypt = require("bcryptjs");
const User = require("../models/User");
const crypto = require("crypto");
const { check, validationResult } = require("express-validator");
const { generateAccessToken, generateRefreshToken } = require("../utils/Token");
const sendVerificationEmail = require("../utils/sendEmail");

/* ======================================================
   🔧 HELPER : format user (single source of truth)
====================================================== */
const formatUser = (user) => ({
  id: user._id,
  Name: user.Name,
  Email: user.Email,
  Phone: user.Phone,
  Role: user.Role,
  isVerified: user.isVerified,
  ProfilePicture: user.ProfilePicture,
  Address: user.Address,
  isProfileComplete: user.isProfileComplete,
});

/* ======================================================
   🟢 POST SIGNUP
====================================================== */
exports.POSTSIGNUP = [
  // -------- VALIDATION -------- //
  check("Role")
    .isIn(["owner", "tenant", "partner"])
    .withMessage("Invalid role"),

  check("Name").notEmpty().withMessage("Name is required"),

  check("Phone").isMobilePhone().withMessage("Invalid phone number"),

  check("Email").isEmail().withMessage("Invalid email address"),

  check("Password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).+$/)
    .withMessage(
      "Password must contain uppercase, lowercase, number, and special character"
    ),

  check("ConfirmPassword").custom((value, { req }) => {
    if (value !== req.body.Password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),

  // -------- CONTROLLER LOGIC -------- //
  async (req, res) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { Role, Name, Phone, Email, Password } = req.body;

      // Check if email already exists
      const existingEmail = await User.findOne({ Email });
      if (existingEmail) {
        return res
          .status(400)
          .json({ message: "User with this email already exists" });
      }

      // Check if phone already exists
      const existingPhone = await User.findOne({ Phone });
      if (existingPhone) {
        return res
          .status(400)
          .json({ message: "User with this phone number already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(Password, 10);

      // Create new user
      const newUser = new User({
        Role,
        Name,
        Phone,
        Email,
        Password: hashedPassword,
      });

      await newUser.save();

      return res.status(201).json({
        message: "User registered successfully",
        user: {
          id: newUser._id,
          Name,
          Email,
          Phone,
          Role,
        },
      });
    } catch (error) {
      console.error("Signup Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
];

/* ======================================================
   🟢 POST LOGIN
====================================================== */
exports.POSTLOGIN = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    const user = await User.findOne({ Email }).select("+Password");

    if (!user || !user.Password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 🔥🔥 FINAL FIX — POORA USER OBJECT PASS KARO
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.RefreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      accessToken,
      user: formatUser(user),
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   🟢 SEND VERIFICATION EMAIL
====================================================== */
exports.SEND_VERIFICATION_EMAIL = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.json({ message: "Account already verified" });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");

    user.VerificationToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.VerificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const verifyLink = `http://localhost:5173/verify?token=${rawToken}`;
    await sendVerificationEmail(user.Email, verifyLink);

    res.json({ message: "Verification email sent successfully" });
  } catch (error) {
    console.error("Send verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   🟢 VERIFY ACCOUNT
====================================================== */
exports.POSTVERIFYACCOUNT = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Token missing" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      VerificationToken: hashedToken,
      VerificationTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.VerificationToken = null;
    user.VerificationTokenExpiry = null;

    await user.save();

    res.json({
      success: true,
      message: "Account verified successfully",
      user: formatUser(user),
    });
  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   🟢 GET CURRENT USER (/auth/me)
====================================================== */
exports.GET_ME = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    res.json({
      success: true,
      user: formatUser(user),
    });
  } catch (error) {
    console.error("GET_ME Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
