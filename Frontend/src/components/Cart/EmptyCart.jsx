import styles from "../../styles/Cart.module.css";
import { useNavigate } from "react-router-dom";
const EmptyCart = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.emptyCartWrap}>
      <div className={styles.emptyCart}>
        <div className={styles.emptyCartIcon}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M3 5h2l2.2 9.2a1 1 0 0 0 1 .8H17a1 1 0 0 0 1-.76L20 7H6M9 19.5a1.25 1.25 0 1 1-2.5 0A1.25 1.25 0 0 1 9 19.5Zm8 0a1.25 1.25 0 1 1-2.5 0A1.25 1.25 0 0 1 17 19.5Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2>Your cart is empty</h2>
        <p>
          Add a service and make your stay more comfortable with trusted local
          support.
        </p>
        <button type="button" onClick={() => navigate("/book/services")}>
          Browse Services
        </button>
        <p className={styles.helpText}>
          <span
            className={styles.helpSpan}
            onClick={() => navigate("/help-center")}
          >
            Need help?
          </span>{" "}
          Contact our support team.
        </p>
      </div>
    </div>
  );
};
export default EmptyCart;
