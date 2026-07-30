import styles from "../../styles/BookServices/BookServices.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
const QuestionAnswers = () => {
  return (
    <div className={styles.QandACon}>
      <span className={styles.tagline}>Help Center</span>
      <span className={styles.Heading}>Questions, answered.</span>
      <div className={styles.DetailsCon}>
        <details>
          <summary>
            <span>How does booking work?</span>
            <span className={styles.DetailIcon}>
              <FontAwesomeIcon icon={faAngleDown} />
            </span>
          </summary>

          <p>
            Choose a service, select your preferred date and time, then confirm
            your booking. A verified professional will be assigned, and you'll
            receive booking updates instantly.
          </p>
        </details>

        <details>
          <summary>
            <span>How do payments work?</span>
            <span className={styles.DetailIcon}>
              <FontAwesomeIcon icon={faAngleDown} />
            </span>
          </summary>

          <p>
            Pay securely online during checkout or after the service is
            completed, depending on the service you've booked. Multiple payment
            options are supported.
          </p>
        </details>

        <details>
          <summary>
            <span>Can I cancel or reschedule a booking?</span>
            <span className={styles.DetailIcon}>
              <FontAwesomeIcon icon={faAngleDown} />
            </span>
          </summary>

          <p>
            Yes. You can cancel or reschedule your booking from the Bookings
            page before the professional begins traveling to your location.
          </p>
        </details>

        <details>
          <summary>
            <span>How do refunds work?</span>
            <span className={styles.DetailIcon}>
              <FontAwesomeIcon icon={faAngleDown} />
            </span>
          </summary>

          <p>
            If your booking is eligible for a refund, the amount will be
            processed back to your original payment method after our support
            team reviews the request.
          </p>
        </details>
      </div>
    </div>
  );
};
export default QuestionAnswers;
