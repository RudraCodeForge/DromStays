import { Link, useNavigate } from "react-router-dom";
import Styles from "../../styles/Support/HelpCenter.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer.jsx";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const HelpCenter = () => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
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

        {/* Top Actions */}
        <div className={Styles.TopActions}>
          <Link to="/tickets" className={Styles.MyTicketsBtn}>
            📋 View My Tickets
          </Link>
        </div>

        {/* ================= OWNER HELP ================= */}
        {role === "owner" && (
          <>
            <h2 className={Styles.RoleTitle}>🏠 Owner Support</h2>

            <div className={Styles.Cards}>
              <Link to="/help-center/booking-issues" className={Styles.Card}>
                <h3>📦 Booking Issues</h3>
                <p>Booking requests, confirmation, cancellations</p>
              </Link>

              <Link to="/help-center/tenant-issues" className={Styles.Card}>
                <h3>👤 Tenant Issues</h3>
                <p>Add / remove tenant, room capacity problems</p>
              </Link>

              <Link to="/help-center/payment-issues" className={Styles.Card}>
                <h3>💳 Payment Issues</h3>
                <p>Payouts, failed payments, deductions</p>
              </Link>

              <Link
                to="/help-center/property-management"
                className={Styles.Card}
              >
                <h3>🏢 Property Management</h3>
                <p>Add property, edit details, room availability</p>
              </Link>

              <Link to="/help-center/account-profile" className={Styles.Card}>
                <h3>⚙️ Account & Profile</h3>
                <p>KYC, profile update, password issues</p>
              </Link>
            </div>
          </>
        )}

        {/* ================= TENANT HELP ================= */}
        {role === "tenant" && (
          <>
            <h2 className={Styles.RoleTitle}>👤 Tenant Support</h2>

            <div className={Styles.Cards}>
              <Link to="/help-center/booking-issues" className={Styles.Card}>
                <h3>📦 Booking Issues</h3>
                <p>Booking status, confirmation, cancellation</p>
              </Link>

              <Link to="/help-center/payment-issues" className={Styles.Card}>
                <h3>💳 Payment Issues</h3>
                <p>Rent payment, refunds, failed transactions</p>
              </Link>

              <Link to="/help-center/stay-issues" className={Styles.Card}>
                <h3>🏠 Stay Issues</h3>
                <p>Room issues, facilities, complaints</p>
              </Link>

              <Link to="/help-center/account-profile" className={Styles.Card}>
                <h3>⚙️ Account & Profile</h3>
                <p>Profile update, password, verification</p>
              </Link>
            </div>
          </>
        )}

        {/* Bottom CTA (Common) */}
        <div className={Styles.BottomHelp}>
          <p>Still can’t find what you’re looking for?</p>
          <Link
            to={`/create_ticket?category=other&role=${role}`}
            className={Styles.SupportBtn}
          >
            Raise a Support Ticket
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default HelpCenter;
