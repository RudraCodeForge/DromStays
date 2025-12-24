const User = require("../models/User");
const Review = require("../models/Review");

const formatUser = (user) => ({
  id: user._id,
  Name: user.Name,
  Email: user.Email,
  Phone: user.Phone,
  Role: user.Role,
  WalletBalance: user.WalletBalance,
  isVerified: user.isVerified,
  ProfilePicture: user.ProfilePicture,
  Address: user.Address,
  isProfileComplete: user.isProfileComplete,
});

exports.UPDATE_PROFILE = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT middleware
    const { Name, Phone, Address } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔒 Prevent restricted updates
    delete req.body.Email;
    delete req.body.Role;
    delete req.body.Password;

    // ✅ Update basic fields
    if (Name) user.Name = Name;

    if (Phone && Phone !== user.Phone) {
      const phoneExists = await User.findOne({ Phone });
      if (phoneExists) {
        return res.status(400).json({ message: "Phone already in use" });
      }
      user.Phone = Phone;
    }

    // ✅ Safe Address Update
    if (Address) {
      user.Address.houseNo = Address.houseNo ?? user.Address.houseNo;
      user.Address.street = Address.street ?? user.Address.street;
      user.Address.locality = Address.locality ?? user.Address.locality;
      user.Address.city = Address.city ?? user.Address.city;
      user.Address.state = Address.state ?? user.Address.state;
      user.Address.pincode = Address.pincode ?? user.Address.pincode;
    }

    // ✅ Auto profile completeness
    user.isProfileComplete = Boolean(
      user.Name && user.Phone && user.Address.city && user.Address.pincode
    );

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: formatUser(user),
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.UPDATE_PROFILE_PICTURE = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT middleware
    const { ProfilePicture } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!ProfilePicture) {
      return res.status(400).json({ message: "ProfilePicture is required" });
    }
    user.ProfilePicture = ProfilePicture;
    await user.save();
    return res.status(200).json({
      message: "Profile picture updated successfully",
      user: formatUser(user),
    });
  } catch (error) {
    console.error("Update Profile Picture Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
