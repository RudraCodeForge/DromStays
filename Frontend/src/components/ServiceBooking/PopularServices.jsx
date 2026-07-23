import styles from "../../styles/BookServices/BookServices.module.css";
import PopularServiceCard from "../PopularServiceCard";
import { popularServices } from "../../data/Services";

const PopularServices = () => {
  return (
    <div className={styles.PopularServicesContainer}>
      <span className={styles.tagline}>Loved in your neighborhood</span>

      <span className={styles.Heading}>Popular services</span>

      <span className={styles.SubHeading}>
        Highly rated services booked by thousands of happy households.
      </span>

      <div className={styles.cardContainer}>
        {popularServices.map((service) => (
          <PopularServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
};

export default PopularServices;
