import styles from "../../styles/BookServices/BookServices.module.css";
import ReviewsSection from "../ReviewSection";
import { reviews } from "../../data/Services";
const ReviewCon = () => {
  return (
    <div className={styles.PopularServicesContainer}>
      <span className={styles.tagline}>From our community</span>

      <span className={styles.Heading}>
        Customers love the DromStays difference
      </span>
      <ReviewsSection reviews={reviews} />
    </div>
  );
};
export default ReviewCon;
