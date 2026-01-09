import { Link } from "react-router-dom";
import Styles from "../../styles/Support/HelpPages.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer.jsx";
import BackButton from "./BackButton.jsx";

const AccountHelp = () => {
  return (
    <>
      <Navbar />
      <div className={Styles.Container}>
        <BackButton />
        <h1>⚙️ Account & Profile</h1>

        <div className={Styles.FAQ}>
          <h3>❓ Unable to update profile?</h3>
          <p>Make sure all required fields are filled correctly.</p>

          <h3>❓ Forgot password?</h3>
          <p>Use the “Forgot Password” option on login screen.</p>

          <h3>❓ Account not verified?</h3>
          <p>Complete verification to unlock all features.</p>
        </div>

        <div className={Styles.Bottom}>
          <Link
            to="/create_ticket?category=account"
            className={Styles.SupportBtn}
          >
            Raise Account Ticket →
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AccountHelp;
