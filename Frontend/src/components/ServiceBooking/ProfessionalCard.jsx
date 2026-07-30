import styles from "../../styles/BookServices/BookServices.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const ProfessionalCard = ({ professional }) => {
  const handleDetails = () => {
    console.log("Details clicked for:", professional);
  };

  const handleBookNow = () => {
    console.log("Book now clicked for:", professional);
  };

  if (!professional) return null;

  return (
    <div className={styles.professionalCard}>
      {/* Profile Section */}
      <div className={styles.profileSection}>
        <img
          src={professional.image || "https://via.placeholder.com/100"}
          alt={professional.name}
          className={styles.profileImage}
        />
        <div className={styles.profileInfo}>
          <h3 className={styles.professionalName}>{professional.name}</h3>
          <p className={styles.profession}>{professional.profession}</p>
          <div className={styles.ratingDistance}>
            <span className={styles.rating}>
              <FontAwesomeIcon icon={faStar} className={styles.starIcon} />
              {professional.rating}
            </span>
            <span className={styles.distance}>{professional.distance}</span>
          </div>
        </div>
        <div className={styles.statusBadge}>
          {professional.status || "Available"}
        </div>
      </div>

      {/* Divider */}
      <div className={styles.cardDivider}></div>

      {/* Footer Section */}
      <div className={styles.footerSection}>
        <span className={styles.priceLabel}>
          Starts{" "}
          <span className={styles.priceAmount}>
            {professional.startingPrice}
          </span>
        </span>
        <div className={styles.buttonGroup}>
          <button className={styles.detailsBtn} onClick={handleDetails}>
            Details
          </button>
          <button className={styles.bookNowBtn} onClick={handleBookNow}>
            Book now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalCard;
