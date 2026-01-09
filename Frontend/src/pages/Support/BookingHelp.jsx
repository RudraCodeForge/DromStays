import { Link } from "react-router-dom";
import Styles from "../../styles/Support/HelpPages.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer.jsx";
import BackButton from "./BackButton.jsx";

const BookingHelp = () => {
  return (
    <>
      <Navbar />
      <div className={Styles.Container}>
        <BackButton />
        <h1>📦 Booking Issues</h1>

        <div className={Styles.FAQ}>
          <h3>❓ Booking confirmed but not visible?</h3>
          <p>
            Please wait a few minutes and refresh. Sometimes sync takes time.
          </p>

          <h3>❓ Booking failed but payment deducted?</h3>
          <p>
            Don’t worry. Amount is auto-refunded within <b>24 hours</b>.
          </p>

          <h3>❓ Booking status pending?</h3>
          <p>
            Pending means owner approval is required. You’ll be notified once
            updated.
          </p>
        </div>

        <div className={Styles.Bottom}>
          <p>Still facing issues?</p>
          <Link to="/create_ticket" className={Styles.SupportBtn}>
            Raise Booking Ticket →
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BookingHelp;
