import Styles from "../../styles/FeedBack.module.css";
import { useState } from "react";
import { submitReview } from "../../services/reviews.js";

const FeedBack = () => {
  const [rating, setRating] = useState(0);

  const Handle_Submit = async (e) => {
    e.preventDefault();
    const message = e.target.message.value;
    const reviewData = { rating, message };
    console.log(reviewData);
    try {
      await submitReview(reviewData);
      alert("Thank you for your feedback!");
      e.target.reset();
      setRating(0);
    } catch (err) {
      alert("Error submitting feedback. Please try again later.");
    }
  };

  return (
    <div className={Styles.feedbackContainer}>
      <div className={Styles.card}>
        <h2>We Value Your Feedback 💬</h2>

        <p className={Styles.subtitle}>
          Your opinions help us improve our services. Please share your thoughts
          with us.
        </p>

        <form className={Styles.feedbackForm} onSubmit={Handle_Submit}>
          {/* Rating */}
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

          {/* Message */}
          <div className={Styles.inputGroup}>
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows="4"
              placeholder="Write your feedback here..."
              required
            ></textarea>
          </div>

          <button type="submit">Submit Feedback</button>
        </form>
      </div>
    </div>
  );
};

export default FeedBack;
