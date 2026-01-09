import { Link } from "react-router-dom";
import Styles from "../../styles/Support/HelpPages.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer.jsx";
import BackButton from "./BackButton.jsx";
const TenantHelp = () => {
  return (
    <>
      <Navbar />
      <div className={Styles.Container}>
        <BackButton />
        <h1>👤 Tenant Issues</h1>

        <div className={Styles.FAQ}>
          <h3>❓ Unable to add tenant?</h3>
          <p>
            Please check room capacity. Tenants cannot exceed allowed capacity.
          </p>

          <h3>❓ Tenant removed accidentally?</h3>
          <p>You can re-add tenant from room details.</p>

          <h3>❓ Tenant not verified?</h3>
          <p>Tenant must complete verification before being fully activated.</p>
        </div>

        <div className={Styles.Bottom}>
          <p>Need personal help?</p>
          <Link to="/create_ticket" className={Styles.SupportBtn}>
            Raise Tenant Ticket →
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TenantHelp;
