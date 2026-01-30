import Styles from "../../styles/FeedBack.module.css";
import { useState, useEffect } from "react";
import { submitReview } from "../../services/reviews.service.js";
import { toast } from "react-toastify";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const FeedBack = () => {
  const [rating, setRating] = useState(0);

  const { requestId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const isRequestReview = Boolean(requestId);

  const {
    requestType,
    roomNo,
    propertyName,
    referenceId,
  } = location.state || {};

  // 🔐 SAFETY GUARD (important)
  useEffect(() => {
    if (isRequestReview && (!requestType || !referenceId)) {
      toast.error("Invalid review access");
      navigate("/");
    }
  }, [isRequestReview, requestType, referenceId, navigate]);

  const reviewType = isRequestReview
    ? requestType === "room_visit"
      ? "ROOM"
      : "SERVICE"
    : "PLATFORM";

  const Handle_Submit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.warning("Please select a rating");
      return;
    }

    const message = e.target.message.value.trim();

    if (!message) {
      toast.warning("Please write a message");
      return;
    }

    const reviewData = {
      rating,
      message,
      reviewType,
      requestId: isRequestReview ? requestId : undefined,
      referenceId: isRequestReview ? referenceId : undefined,
      snapshot: isRequestReview
        ? {
          roomNo,
          propertyName,
        }
        : undefined,
    };

    try {
      await submitReview(reviewData);
      toast.success("Thank you for your feedback!");

      e.target.reset();
      setRating(0);

      navigate("/");
    } catch (err) {
      toast.error(
        err?.message || "Error submitting feedback. Please try again."
      );
    }
  };

  return (
    <div className={Styles.feedbackContainer}>
      <div className={Styles.card}>
        <h2>
          {reviewType === "ROOM"
            ? "Rate Your Room Visit ⭐"
            : reviewType === "SERVICE"
              ? "Rate the Service 🔧"
              : "We Value Your Feedback 💬"}
        </h2>

        <p className={Styles.subtitle}>
          {reviewType === "ROOM"
            ? `How was your visit to room ${roomNo || ""}?`
            : reviewType === "SERVICE"
              ? "Please share your service experience."
              : "Your opinions help us improve our platform."}
        </p>

        <form className={Styles.feedbackForm} onSubmit={Handle_Submit}>
          {/* ⭐ Rating */}
          <div className={Styles.inputGroup}>
            <label>Rating</label>
            <div className={Styles.ratingInput}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={i < rating ? Styles.filled : ""}
                  onClick={() => setRating(i + 1)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          {/* 📝 Message */}
          <div className={Styles.inputGroup}>
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows="4"
              placeholder={
                reviewType === "ROOM"
                  ? "How was the room and overall visit?"
                  : reviewType === "SERVICE"
                    ? "How was the service experience?"
                    : "Write your feedback here..."
              }
              required
            />
          </div>

          <button type="submit">
            {reviewType === "PLATFORM" ? "Submit Feedback" : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedBack;
