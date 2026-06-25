import ReviewCard from "./ReviewCard";
import Style from "../styles/ReviewCard.module.css";

const ReviewsSection = ({ reviews = [] }) => {
  return (
    <div className={Style.ReviewCard_Con}>
      {reviews
        .filter((item) => item?.ReviewType === "PLATFORM")
        .map((item, index) => (
          <ReviewCard key={index} item={item} />
        ))}
    </div>
  );
};

export default ReviewsSection;