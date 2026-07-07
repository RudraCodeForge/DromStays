import { useNavigate } from "react-router-dom";
import { FiUserPlus, FiClipboard, FiArrowRight } from "react-icons/fi";
import styles from "../../styles/NoPartnerProfile.module.css";

const NoPartnerProfile = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.iconCircle}>
          <FiClipboard className={styles.icon} />
        </div>

        <h2>Create Your Partner Profile</h2>

        <p>
          Complete your partner profile to start adding services, manage
          bookings, receive customer requests and grow your business with us.
        </p>

        <button
          className={styles.button}
          onClick={() => navigate("/Partner/Profile")}
        >
          <FiUserPlus />
          Setup Profile Now
          <FiArrowRight />
        </button>

        <div className={styles.patternTop}></div>
        <div className={styles.patternBottom}></div>
      </div>
    </div>
  );
};

export default NoPartnerProfile;
