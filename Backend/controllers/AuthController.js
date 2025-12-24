const bcrypt = require("bcryptjs");
const User = require("../models/User");
const crypto = require("crypto");
const { check, validationResult } = require("express-validator");
const { generateAccessToken, generateRefreshToken } = require("../utils/Token");
const {
  sendVerificationEmail,
  sendResetPasswordEmail,
} = require("../utils/sendEmail");

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
  Subscriptions: user.Subscriptions,
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
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
    🟢 UPDATE PASSWORD
====================================================== */

exports.UPDATE_PASSWORD = async (req, res) => {
  try {
    const { Current_Password, New_Password } = req.body;

    if (!Current_Password || !New_Password) {
      return res.status(400).json({
        success: false,
        errors: ["All fields are required"],
      });
    }

    // 🔹 Password strength validation
    const passwordErrors = [];

    if (New_Password.length < 8)
      passwordErrors.push("Password must be at least 8 characters long");
    if (!/[A-Z]/.test(New_Password))
      passwordErrors.push("Password must contain an uppercase letter");
    if (!/[a-z]/.test(New_Password))
      passwordErrors.push("Password must contain a lowercase letter");
    if (!/[0-9]/.test(New_Password))
      passwordErrors.push("Password must contain a number");
    if (!/[!@#$%^&*]/.test(New_Password))
      passwordErrors.push("Password must contain a special character");

    if (passwordErrors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: passwordErrors,
      });
    }

    const user = await User.findById(req.user.id).select("+Password");
    if (!user) {
      return res.status(404).json({
        success: false,
        errors: ["User not found"],
      });
    }

    // 🔹 Current password check
    const isMatch = await bcrypt.compare(Current_Password, user.Password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        errors: ["Current password is incorrect"],
      });
    }

    // 🔹 Prevent same password reuse
    const isSame = await bcrypt.compare(New_Password, user.Password);
    if (isSame) {
      return res.status(400).json({
        success: false,
        errors: ["New password must be different from current password"],
      });
    }

    // 🔹 Hash & save new password
    user.Password = await bcrypt.hash(New_Password, 10);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      errors: ["Server error. Please try again later"],
    });
  }
};

exports.POSTFORGETPASSWORD = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ Email: email });
    if (!user) {
      return res
        .status(200)
        .json({ message: "If the email exists, a reset link has been sent." });
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.ResetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.ResetPasswordExpiry = Date.now() + 60 * 60 * 1000;
    await user.save();
    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;
    await sendResetPasswordEmail(user.Email, resetLink);
    res
      .status(200)
      .json({ message: "If the email exists, a reset link has been sent." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.POSTRESETPASSWORD = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      ResetPasswordToken: hashedToken,
      ResetPasswordExpiry: { $gt: Date.now() },
    }).select("+Password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    user.Password = await bcrypt.hash(newPassword, 10);
    user.ResetPasswordToken = null;
    user.ResetPasswordExpiry = null;

    // 🔐 FORCE LOGOUT ALL DEVICES
    user.tokenVersion += 1;
    user.RefreshToken = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.LOGOUT_ALL_DEVICES = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.tokenVersion += 1;
    user.RefreshToken = null;
    await user.save();

    res.clearCookie("refreshToken");

    res.status(200).json({
      success: true,
      message: "Logged out from all devices successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
