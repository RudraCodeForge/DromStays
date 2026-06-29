import styles from "../../styles/Services.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWrench,
  faMoneyBills,
  faBell,
  faMedal,
} from "@fortawesome/free-solid-svg-icons";

const PartnerSideBar = ({ Link, setLink }) => {
  return (
    <nav className={styles.impLinks} aria-label="partner sidebar">
      <ul>
        <li
          className={`${styles.impLinkItem} ${
            Link === "services" ? styles.activeLink : ""
          }`}
          onClick={() => setLink("services")}
        >
          <FontAwesomeIcon icon={faWrench} className={styles.icon} />
          <span className={styles.linktext}>Services</span>
        </li>

        <li
          className={`${styles.impLinkItem} ${
            Link === "earnings" ? styles.activeLink : ""
          }`}
          onClick={() => setLink("earnings")}
        >
          <FontAwesomeIcon icon={faMoneyBills} className={styles.icon} />
          <span className={styles.linktext}>Earnings</span>
        </li>

        <li
          className={`${styles.impLinkItem} ${
            Link === "requests" ? styles.activeLink : ""
          }`}
          onClick={() => setLink("requests")}
        >
          <FontAwesomeIcon icon={faBell} className={styles.icon} />
          <span className={styles.linktext}>Requests</span>
        </li>
      </ul>

      <button type="button" className={styles.upgradeButton}>
        <FontAwesomeIcon icon={faMedal} className={styles.upgradeIcon} />
        <span>Upgrade Plan</span>
      </button>
    </nav>
  );
};

export default PartnerSideBar;
