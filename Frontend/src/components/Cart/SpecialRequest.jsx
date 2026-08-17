import styles from "../../styles/Cart.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";

const SpecialRequest = ({ Request, setSpecialRequest }) => {
  return (
    <div className={styles.RequestContainer}>
      <div className={styles.RequestHeadingCon}>
        <div className={styles.iconCon}>
          <FontAwesomeIcon icon={faWandMagicSparkles} />
        </div>
        <div className={styles.RequestTextCon}>
          <h2>Special Requests</h2>
          <p>We’ll try our best to accommodate you.</p>
        </div>
      </div>
      <textarea
        id="disc"
        className={styles.disc}
        placeholder="Add Your special instruction to your stay or services..."
        onChange={(e) => setSpecialRequest(e.target.value)}
      />
    </div>
  );
};
export default SpecialRequest;
