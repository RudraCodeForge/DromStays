import { Link } from "react-router-dom";
import Styles from "../../styles/Support/HelpCenter.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer.jsx";

const HelpCenter = () => {
  return (
    <>
      {" "}
      <Navbar />
      <div className={Styles.Container}>
        {/* Header */}
        <div className={Styles.Header}>
          <h1>Help Center</h1>
          <p>
            Find quick answers to common problems or raise a support request if
            needed.
          </p>
        </div>

        {/* Categories */}
        <div className={Styles.Cards}>
          <Link to="/help-center/booking-issues" className={Styles.Card}>
            <h3>📦 Booking Issues</h3>
            <p>Payment, confirmation, booking status</p>
          </Link>

          <Link to="/help-center/tenant-issues" className={Styles.Card}>
            <h3>👤 Tenant Issues</h3>
            <p>Add tenant, remove tenant, capacity problems</p>
          </Link>

          <Link to="/help-center/payment-issues" className={Styles.Card}>
            <h3>💳 Payment Issues</h3>
            <p>Refunds, failed payments, deductions</p>
          </Link>

          <Link to="/help-center/account-profile" className={Styles.Card}>
            <h3>⚙️ Account & Profile</h3>
            <p>Profile update, password, verification</p>
          </Link>
        </div>

        {/* Bottom CTA */}
        <div className={Styles.BottomHelp}>
          <p>Still can’t find what you’re looking for?</p>
          <Link to="/create_ticket" className={Styles.SupportBtn}>
            Raise a Support Ticket
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HelpCenter;
