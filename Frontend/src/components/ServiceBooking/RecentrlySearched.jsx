import styles from "../../styles/BookServices/BookServices.module.css";
import { recentlySearched } from "../../data/recentlySearched";
import { NavLink } from "react-router-dom";
const RecentlySearched = () => {
  return (
    <div className={styles.RecentlySearchedCon}>
      <div className={styles.RecentlySearchedConleft}>
        <span className={styles.tagline}>SAVED FOR LATER</span>
        <span className={styles.Heading}>Recently searched</span>
        <span className={styles.SubHeading}>Pick up where you left off.</span>
        <div className={styles.RecentlySearchedBadges}>
          {recentlySearched.map((item) => (
            <span key={item.id} className={styles.RecentlySearchedBadge}>
              {item.name}
            </span>
          ))}
        </div>
      </div>
      <div className={styles.RecentlySearchedConRight}>
        <span className={styles.tagline}>
          Your next service is closer than you think
        </span>
        <span className={styles.Heading}>
          Trusted help is available in your neighborhood today.
        </span>
        <NavLink to="/services" className={styles.tagline}>
          Explore nearby pros →
        </NavLink>
      </div>
    </div>
  );
};
export default RecentlySearched;
