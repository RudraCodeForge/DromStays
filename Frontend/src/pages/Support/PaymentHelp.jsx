import { Link } from "react-router-dom";
import Styles from "../../styles/Support/HelpPages.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer.jsx";
import BackButton from "./BackButton.jsx";
const PaymentHelp = () => {
  return (
    <>
      <Navbar />
      <div className={Styles.Container}>
        <BackButton />
        <h1>💳 Payment Issues</h1>

        <div className={Styles.FAQ}>
          <h3>❓ Payment deducted twice?</h3>
          <p>Extra amount will be auto-refunded within 24–48 hours.</p>

          <h3>❓ Refund not received?</h3>
          <p>Refund depends on bank. It may take 3–5 working days.</p>

          <h3>❓ Payment failed?</h3>
          <p>Please retry using stable internet or different payment method.</p>
        </div>

        <div className={Styles.Bottom}>
          <Link
            to="/create_ticket?category=payment"
            className={Styles.SupportBtn}
          >
            Raise Payment Ticket →
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentHelp;
