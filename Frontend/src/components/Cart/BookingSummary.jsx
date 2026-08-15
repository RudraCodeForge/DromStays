import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faWandMagicSparkles,
  faShield,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/Cart.module.css";
import { useNavigate } from "react-router-dom";

const BookingSummary = ({
  couponCode,
  setCouponCode,
  couponMessage,
  couponStatus,
  isLoading,
  handleApplyCoupon,
  handleRemoveCoupon,
  ServiceTotal,
  PlatformFee,
  EffectiveDiscount,
  FinalAmount,
  checkout,
  faCircleInfo,
}) => {
  const navigate = useNavigate();
  // Get current date
  const currentDate = new Date();
  const BookingDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

  return (
    <div className={styles.BookingSummary}>
      {/* Booking Summary Header */}
      <div className={styles.bookingSummaryHeader}>
        <h2 className={styles.heading}>Booking Summary</h2>
        <h2 className={styles.bookingDate}>{BookingDate}</h2>
      </div>

      {/* Coupon Section */}
      <div className={styles.CouponSection}>
        <h3 className={styles.couponHeading}>Have a coupon?</h3>
        <div className={styles.couponInputContainer}>
          <input
            type="text"
            placeholder="Enter coupon code"
            className={styles.couponInput}
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === "Enter" && handleApplyCoupon()}
            disabled={isLoading || couponStatus === "success"}
            maxLength="20"
            aria-label="Coupon code input"
          />
          <button
            className={styles.applyCouponButton}
            onClick={handleApplyCoupon}
            disabled={isLoading || !couponCode.trim()}
            aria-label="Apply coupon button"
          >
            {isLoading ? "Applying..." : "Apply"}
          </button>
        </div>
        {couponMessage && (
          <p
            className={`${styles.couponMessage} ${styles[couponStatus]}`}
            role="alert"
          >
            {couponStatus === "loading" ? (
              <>
                Verifying
                <span className={styles.dots}>
                  <span className={styles.dot}></span>
                  <span className={styles.dot}></span>
                  <span className={styles.dot}></span>
                </span>
              </>
            ) : (
              couponMessage
            )}
          </p>
        )}
      </div>

      {/* Amount Container */}
      <div className={styles.AmountContainer}>
        <span className={styles.totalAmountLabel}>Services</span>
        <span className={styles.totalAmountValue}>
          ₹{ServiceTotal.toLocaleString("en-IN")}
        </span>

        <span className={styles.totalAmountLabel}>Platform Fee</span>
        <span className={styles.totalAmountValue}>₹{PlatformFee}</span>

        {/* Applied Discount Row with Remove Button */}
        <div className={styles.discountRow}>
          <span className={styles.totalAmountLabel}>Applied Discount</span>
          {couponStatus === "success" && (
            <button
              className={styles.removeCoupon}
              onClick={handleRemoveCoupon}
              title="Remove coupon"
              aria-label="Remove coupon"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          )}
        </div>
        <span className={styles.totalAmountValue}>
          {EffectiveDiscount > 0
            ? `- ₹${EffectiveDiscount.toLocaleString("en-IN")}`
            : "₹0"}
        </span>

        {/* Total Amount */}
        <span className={styles.totalAmountLabel}>Total Amount</span>
        <span className={styles.totalAmountValue}>
          ₹{FinalAmount.toLocaleString("en-IN")}
        </span>

        {/* Savings Note */}
        {EffectiveDiscount > 0 && (
          <p className={styles.finalAmountNote}>
            <FontAwesomeIcon icon={faWandMagicSparkles} /> You Save ₹
            {EffectiveDiscount.toLocaleString("en-IN")} with Dromstays
          </p>
        )}
      </div>
      <button className={styles.checkoutButton} onClick={checkout}>
        Proceed to Checkout
      </button>

      <div className={styles.impPoints}>
        <h3>
          <FontAwesomeIcon icon={faShield} /> Secure payment
        </h3>
        <p>Your payment information is encrypted and secure.</p>
      </div>

      <details className={styles.cancellationDetails}>
        <summary className={styles.cancellationSummary}>
          <FontAwesomeIcon icon={faChevronDown} className={styles.chevron} />
          <span>Cancellation Policy</span>
        </summary>
        <div className={styles.cancellationContent}>
          <p className={styles.policyDescription}>
            <strong>Free cancellation</strong> before partner starts the trip.
          </p>
          <button
            className={styles.viewPolicyButton}
            onClick={() => navigate("/cancellation-policy")}
          >
            View Full Policy
          </button>
        </div>
      </details>
    </div>
  );
};

export default BookingSummary;
