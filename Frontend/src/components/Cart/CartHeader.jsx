import styles from "../../styles/Cart.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, fa2, fa3 } from "@fortawesome/free-solid-svg-icons";
const CartHeader = () => {
  return (
    <div className={styles.Header}>
      <span className={styles.cartTitle}>BOOKING CART</span>
      <h2 className={styles.cartSubtitle}>Your Services</h2>
      <div className={styles.cartDescriptionContainer}>
        <p className={styles.cartDescription}>
          Review your selected stay and services before confirming.
        </p>
        <div className={styles.SpanContainer}>
          <span className={styles.sp1} onClick={() => window.history.back()}>
            <FontAwesomeIcon icon={faCircleCheck} />
            Selection
          </span>
          <p className={styles.bar}></p>
          <span className={styles.sp2}>
            <FontAwesomeIcon icon={fa2} className={styles.icon} />. Review &
            Address
          </span>
          <p className={styles.bar2}></p>
          <span className={styles.sp3}>
            <FontAwesomeIcon icon={fa3} className={styles.icon} />. Payment
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartHeader;
