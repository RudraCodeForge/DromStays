import styles from "../styles/BookServices/BookServices.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faClock } from "@fortawesome/free-solid-svg-icons";

const PopularServiceCard = ({ service }) => {
  return (
    <div className={styles.PopularServicesCard}>
      <div className={styles.serviceImage}>
        {service.image ? (
          <img src={service.image} className={styles.serviceImg} />
        ) : null}
        <span className={styles.serviceBadge}>{service.badge}</span>
      </div>

      <div className={styles.serviceInfo}>
        <h3 className={styles.serviceTitle}>{service.title}</h3>
        <p className={styles.serviceDesc}>{service.description}</p>
      </div>

      <div className={styles.serviceMeta}>
        <span className={styles.metaItem}>
          <FontAwesomeIcon icon={faStar} style={{ color: "#FFC107" }} />{" "}
          {service.rating}
        </span>

        <span className={styles.metaItem} style={{ color: "grey" }}>
          <FontAwesomeIcon icon={faClock} /> {service.duration}
        </span>
      </div>

      <div className={styles.cardFooter}>
        <span className={styles.priceText}>
          <span className={styles.priceSpan}>Starting</span> ₹{service.price}
        </span>

        <button
          type="button"
          className={styles.bookButton}
          onClick={() => console.log("Service details:", service)}
        >
          BOOK NOW
        </button>
      </div>
    </div>
  );
};

export default PopularServiceCard;
