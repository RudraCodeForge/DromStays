import { FaFacebook, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa";
import Styles from "../styles/Footer.module.css";
import { NavLink } from "react-router-dom";
const Footer = () => {
  return (
    <footer className={Styles.mainFooter}>
      <div className={Styles.footerContainer}>
        {/* Column 1 */}
        <div className={Styles.footerCol}>
          <h2 className={Styles.footerLogo}>DromStays</h2>

          <p className={Styles.footerTagline}>
            Affordable Rooms • Secure Stay • Easy Booking
          </p>

          <div className={Styles.footerSocial}>
            <a href="#" className={Styles.icon} data-title="Facebook">
              <FaFacebook />
            </a>

            <a href="#" className={Styles.icon} data-title="Instagram">
              <FaInstagram />
            </a>

            <a href="#" className={Styles.icon} data-title="YouTube">
              <FaYoutube />
            </a>

            <a href="#" className={Styles.icon} data-title="Twitter">
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* Column 2 */}
        <div className={Styles.footerCol}>
          <h3 className={Styles.footerHeading}>Quick Links</h3>
          <ul className={Styles.footerList}>
            <li>
              <NavLink to="/rooms">Rooms</NavLink>
            </li>
            <li>
              <NavLink to="/about_us">About Us</NavLink>
            </li>
            <li>
              <NavLink to="/contact_support">Contact</NavLink>
            </li>
            <li>
              <NavLink to="/privacy_policy">Privacy Policy</NavLink>
            </li>
            <li>
              <NavLink to="/feedback">Feedback</NavLink>
            </li>
          </ul>
        </div>

        {/* Column 3 */}
        <div className={Styles.footerCol}>
          <h3 className={Styles.footerHeading}>Support</h3>
          <ul className={Styles.footerList}>
            <li>
              <a href="#">Help Center</a>
            </li>
            <li>
              <a href="#">Booking Issues</a>
            </li>
            <li>
              <a href="#">Cancellation</a>
            </li>
            <li>
              <a href="#">Report Problem</a>
            </li>
          </ul>
        </div>

        {/* Column 4 */}
        <div className={Styles.footerCol}>
          <h3 className={Styles.footerHeading}>Download App</h3>
          <ul className={Styles.footerList}>
            <li>
              <a href="#">Google Play</a>
            </li>
            <li>
              <a href="#">App Store</a>
            </li>
          </ul>
        </div>
      </div>

      <hr className={Styles.footerLine} />

      <p className={Styles.footerCopy}>
        © {new Date().getFullYear()} DromStays. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
