import styles from "../../styles/BookServices/BookServices.module.css";
import { NavLink } from "react-router-dom";
import { couponData } from "../../data/coupons";
const gradientColors = [
  { color1: "#2563eb", color2: "#1e40af" }, // Blue
  { color1: "#9333ea", color2: "#7e22ce" }, // Purple
  { color1: "#ec4899", color2: "#be185d" }, // Pink
  { color1: "#f59e0b", color2: "#d97706" }, // Amber
  { color1: "#10b981", color2: "#059669" }, // Emerald
  { color1: "#ef4444", color2: "#dc2626" }, // Red
  { color1: "#06b6d4", color2: "#0891b2" }, // Cyan
  { color1: "#8b5cf6", color2: "#7c3aed" }, // Violet
];

const getRandomGradient = (id) => {
  return gradientColors[id % gradientColors.length];
};

const CoupunContainer = () => {
  return (
    <div className={styles.CouponContainer}>
      <div className={styles.CouponHeader}>
        <div className={styles.CouponHeaderContent}>
          <span className={styles.tagline}>WORTH DISCOVERING</span>
          <span className={styles.Heading}>
            Made for your home, and your wallet
          </span>
        </div>
        <NavLink to="/offers" className={styles.SeeMoreLink}>
          See More Offers →
        </NavLink>
      </div>
      <div className={styles.CouponCardContainer}>
        {couponData.map((coupon) => {
          const gradient = getRandomGradient(coupon.id);
          return (
            <div
              key={coupon.id}
              className={styles.Couponcard}
              style={{
                "--color1": gradient.color1,
                "--color2": gradient.color2,
              }}
            >
              <div>
                <div className={styles.CouponTagline}>{coupon.tagline}</div>
                <div className={styles.CouponDiscount}>{coupon.discount}</div>
                <span className={styles.CouponDescription}>
                  {coupon.description}
                </span>
              </div>
              <a href="#" className={styles.ClaimOfferLink}>
                Claim offer
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default CoupunContainer;
