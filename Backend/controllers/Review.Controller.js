const Review = require("../models/Review");
const User = require("../models/User");
const Request = require("../models/Requests");

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
    const { rating, message, reviewType, requestId, referenceId } = req.body;

    // 🔹 Basic validation
    if (!rating || !message || !reviewType) {
      return res
        .status(400)
        .json({ message: "Rating, message and review type are required" });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const cleanMessage = message.trim();
    if (cleanMessage.length < 5 || cleanMessage.length > 500) {
      return res.status(400).json({
        message: "Message must be between 5 and 500 characters",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔹 Request based review validation
    if (reviewType !== "PLATFORM") {
      if (!requestId || !referenceId) {
        return res.status(400).json({
          message: "Request ID and reference ID are required",
        });
      }

      const request = await Request.findById(requestId);
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      if (!request.reviewEligible) {
        return res.status(403).json({
          message: "Review not allowed for this request",
        });
      }

      // 🔒 Duplicate review protection
      const alreadyReviewed = await Review.findOne({
        user: userId,
        reviewType,
        referenceId,
      });

      if (alreadyReviewed) {
        return res.status(409).json({
          message: "You have already reviewed this",
        });
      }
    }

    // 🔥 Create review
    const newReview = new Review({
      user: userId,
      rating,
      message: cleanMessage,
      reviewType,
      requestId: requestId || null,
      referenceId: referenceId || null,
      title: getTitleFromRole(user.Role),
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
    const reviews = await Review.find({ isApproved: true })
      .populate("user", "Name ProfilePicture Role")
      .sort({ createdAt: -1 });

    const formattedReviews = reviews.map((review) => ({
      ProfileImg: review.user?.ProfilePicture || "",
      Name: review.user?.Name || "Anonymous",
      Title: review.title || "User",
      Desc: review.message,
      Rating: review.rating,
      ReviewType: review.reviewType,
    }));

    return res.status(200).json(formattedReviews);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.GET_REVIEWS = async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: false })
      .populate("user", "Name ProfilePicture Role")
      .sort({ createdAt: -1 });

    const formattedReviews = reviews.map((review) => ({
      ProfileImg: review.user?.ProfilePicture || "",
      Name: review.user?.Name || "Anonymous",
      Title: review.title || "User",
      Desc: review.message,
      Rating: review.rating,
      ReviewType: review.reviewType,
    }));

    return res.status(200).json(formattedReviews);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
