const bcrypt = require("bcryptjs");
const User = require("../models/User");
const crypto = require("crypto");
const { check, validationResult } = require("express-validator");
const { generateAccessToken, generateRefreshToken } = require("../utils/Token");
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

exports.POSTLOGIN = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    // Find user by email
    const user = await User.findOne({ Email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    // Compare passwords
    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    // Successful login

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.RefreshToken = refreshToken;
    await user.save();

    // 5️⃣ Send refresh token in httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // production me true
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        Name: user.Name,
        Email: user.Email,
        Role: user.Role,
        Phone: user.Phone,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.SEND_VERIFICATION_EMAIL = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.json({ message: "Account already verified" });
    }

    // 🔑 RAW TOKEN
    const rawToken = crypto.randomBytes(32).toString("hex");

    // 🔐 HASHED TOKEN (DB)
    user.VerificationToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.VerificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24h

    await user.save();

    const verifyLink = `http://localhost:5173/verify?token=${rawToken}`;

    console.log("VERIFY LINK:", verifyLink);

    // TODO: nodemailer yahan lagana hai
    // await sendEmail(user.Email, verifyLink);

    return res.json({
      message: "Verification email sent successfully",
    });
  } catch (error) {
    console.error("Send verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

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

    res.json({ message: "Account verified successfully" });
  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
