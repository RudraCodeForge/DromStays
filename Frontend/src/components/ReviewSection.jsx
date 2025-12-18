import ReviewCard from "./ReviewCard";
import Style from "../styles/ReviewCard.module.css";

const ReviewsSection = ({ reviews }) => {
  return (
    <div className={Style.ReviewCard_Con}>
      {reviews.map((item, index) => (
        <ReviewCard key={index} item={item} />
      ))}
    </div>
  );
};

export default ReviewsSection;
