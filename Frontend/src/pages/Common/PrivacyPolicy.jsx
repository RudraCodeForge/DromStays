import Styles from "../../styles/PrivacyPolicy.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer.jsx";
const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />
      <div className={Styles.wrapper}>
        {/* HEADER */}
        <section className={Styles.header}>
          <h1>Privacy Policy & Terms of Use</h1>
          <p>
            This document explains how Dormstays collects, uses, and protects
            your information, along with the terms governing the use of our
            platform.
          </p>
          <small>Last updated: 22 September 2025</small>
        </section>

        {/* INTRO */}
        <section className={Styles.section}>
          <p>
            Dormstays (“we”, “our”, “us”) operates as a shared living and
            service discovery platform connecting property owners, tenants, and
            service partners. By accessing or using Dormstays, you agree to the
            policies described on this page.
          </p>
        </section>

        {/* PRIVACY */}
        <section className={Styles.section}>
          <h2>1. Privacy Policy</h2>
          <p>
            We respect your privacy and are committed to protecting your
            personal data. We collect only the information that is necessary to
            provide and improve our services.
          </p>

          <h3>Information We Collect</h3>
          <ul>
            <li>
              Personal details such as name, email address, and phone number
            </li>
            <li>Profile information provided voluntarily by the user</li>
            <li>User role (Owner, Tenant, or Service Partner)</li>
            <li>Usage and technical data such as device type and IP address</li>
          </ul>
        </section>

        {/* DATA USAGE */}
        <section className={Styles.section}>
          <h2>2. Use of Information</h2>
          <p>Your information is used for the following purposes:</p>
          <ul>
            <li>Creating and managing user accounts</li>
            <li>Enabling room listings, bookings, and service requests</li>
            <li>Facilitating communication between users</li>
            <li>Improving platform security and performance</li>
            <li>Complying with legal and regulatory requirements</li>
          </ul>

          <p className={Styles.highlight}>
            Dormstays does not sell, rent, or trade personal data to third
            parties.
          </p>
        </section>

        {/* DATA SHARING */}
        <section className={Styles.section}>
          <h2>3. Data Sharing & Disclosure</h2>
          <p>
            We may share limited user information only when required for
            platform functionality or legal compliance, including:
          </p>
          <ul>
            <li>
              Between owners and tenants for booking-related communication
            </li>
            <li>Between tenants and service partners for service delivery</li>
            <li>With legal authorities when required by law</li>
          </ul>
        </section>

        {/* TERMS */}
        <section className={Styles.section}>
          <h2>4. Terms of Use</h2>
          <p>
            By using Dormstays, users agree to act responsibly and provide
            accurate information. The following responsibilities apply:
          </p>
          <ul>
            <li>
              Owners must provide truthful and up-to-date property details
            </li>
            <li>Tenants must make genuine bookings and payments</li>
            <li>
              Service partners must deliver services honestly and professionally
            </li>
          </ul>

          <p>
            Dormstays acts solely as a technology platform and does not own,
            control, or manage any listed properties or services.
          </p>
        </section>

        {/* PAYMENTS */}
        <section className={Styles.section}>
          <h2>5. Payments & Transactions</h2>
          <p>
            All transactions conducted through Dormstays must be lawful and
            genuine. Any attempt at fraud, misuse, or chargeback abuse may
            result in account suspension or termination.
          </p>
        </section>

        {/* REFUND */}
        <section className={Styles.section}>
          <h2>6. Refunds & Cancellations</h2>
          <p>
            Refund and cancellation policies may vary depending on property
            owners or service partners. Dormstays does not guarantee refunds but
            will assist in dispute resolution where possible.
          </p>
        </section>

        {/* COOKIES */}
        <section className={Styles.section}>
          <h2>7. Cookies Policy</h2>
          <p>
            Dormstays uses cookies and similar technologies to maintain login
            sessions, enhance security, and improve user experience. Users may
            manage cookies through their browser settings.
          </p>
        </section>

        {/* ACCOUNT */}
        <section className={Styles.section}>
          <h2>8. Account Suspension & Termination</h2>
          <p>
            Dormstays reserves the right to suspend or terminate any account
            found to be in violation of these policies, including cases of
            fraud, misinformation, abuse, or illegal activity.
          </p>
        </section>

        {/* LIABILITY */}
        <section className={Styles.section}>
          <h2>9. Limitation of Liability</h2>
          <p>
            Dormstays shall not be liable for disputes, losses, or damages
            arising between users. All interactions and agreements are made at
            the users’ own discretion and risk.
          </p>
        </section>

        {/* UPDATES */}
        <section className={Styles.section}>
          <h2>10. Policy Updates</h2>
          <p>
            We may update these policies from time to time. Continued use of the
            platform after updates implies acceptance of the revised terms.
          </p>
        </section>

        {/* CONTACT */}
        <section className={Styles.section}>
          <h2>11. Contact Information</h2>
          <p>
            For any questions or concerns related to privacy or terms, please
            contact us at:
          </p>
          <p className={Styles.contact}>
            📧 support@dormstays.com <br />
            📍 India
          </p>
        </section>

        {/* FOOTER */}
        <footer className={Styles.footer}>
          <p>
            Dormstays is committed to transparency, trust, and responsible
            platform usage.
          </p>
        </footer>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
