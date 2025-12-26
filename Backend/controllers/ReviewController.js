const Review = require("../models/Review");
const User = require("../models/User");

const getTitleFromRole = (role) => {
  switch (role) {
    case "admin":
      return "Administrator";
    case "owner":
      return "Verified Owner";
    case "tenant":
      return "Happy Renter";
    default:
      return "User";
  }
};

exports.SUBMIT_REVIEW = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rating, message } = req.body;

    if (!rating || !message) {
      return res
        .status(400)
        .json({ message: "Rating and message are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const updatedMessage = message.trim();
    if (updatedMessage.length === 0) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    if (updatedMessage.length > 500) {
      return res
        .status(400)
        .json({ message: "Message too long (max 500 chars)" });
    }

    const newReview = new Review({
      user: userId,
      rating, // ✅ correct
      message: updatedMessage, // ✅ correct
      title: getTitleFromRole(user.Role), // ✅ optional but best
      isApproved: false,
    });

    await newReview.save();

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.GET_REVIEWS = async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: false }).populate(
      "user",
      "Name ProfilePicture Role"
    );

    // 🔁 Transform DB data → frontend-friendly format
    const formattedReviews = reviews.map((review) => ({
      ProfileImg: review.user?.ProfilePicture || "",
      Name: review.user?.Name || "Anonymous",
      Title: review.title || "User",
      Desc: review.message,
      Rating: review.rating,
    }));

    return res.status(200).json(formattedReviews);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
