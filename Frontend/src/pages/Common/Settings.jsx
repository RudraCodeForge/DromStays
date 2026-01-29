import Styles from "../../styles/Settings.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const role = user?.Role?.toLowerCase(); // owner | tenant | partner

  return (
    <>
      <Navbar />

      <div className={Styles.container}>
        <h1 className={Styles.title}>Settings</h1>

        {/* 🔔 Notifications */}
        <div className={Styles.card}>
          <h3>🔔 Notification Preferences</h3>
          <p>Manage how you receive alerts</p>

          <ul>
            <li>
              <NavLink to="/settings/notifications" className={Styles.link}>
                Notification Settings
              </NavLink>
            </li>
          </ul>
        </div>

        {/* 👑 OWNER */}
        {role === "owner" && (
          <>
            <div className={Styles.card}>
              <h3>⭐ Subscriptions</h3>
              <p>Manage your plan and billing</p>

              <ul>
                <li>
                  <NavLink to="/SubscriptionPlans" className={Styles.link}>
                    Manage Subscription
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/owner/invoices" className={Styles.link}>
                    Billing & Invoices
                  </NavLink>
                </li>
              </ul>
            </div>

            <div className={Styles.card}>
              <h3>💰 Payment Preferences</h3>
              <p>Configure payouts and rent collection</p>

              <ul>
                <li>
                  <NavLink to="/settings/bank" className={Styles.link}>
                    Bank Account Details
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/settings/payouts" className={Styles.link}>
                    Payout Preferences
                  </NavLink>
                </li>
              </ul>
            </div>
          </>
        )}

        {/* 🧍 TENANT */}
        {role === "tenant" && (
          <div className={Styles.card}>
            <h3>💳 Payment Settings</h3>
            <p>Manage your payments</p>

            <ul>
              <li>
                <NavLink to="/settings/payments" className={Styles.link}>
                  Payment Methods
                </NavLink>
              </li>
              <li>
                <NavLink to="/settings/history" className={Styles.link}>
                  Payment History
                </NavLink>
              </li>
            </ul>
          </div>
        )}

        {/* 🤝 PARTNER */}
        {role === "partner" && (
          <>
            <div className={Styles.card}>
              <h3>🛠️ Service Preferences</h3>
              <p>Control your service settings</p>

              <ul>
                <li>
                  <NavLink to="/settings/services" className={Styles.link}>
                    Manage Services
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/settings/pricing" className={Styles.link}>
                    Service Pricing
                  </NavLink>
                </li>
              </ul>
            </div>

            <div className={Styles.card}>
              <h3>💸 Payout Settings</h3>
              <p>Manage your earnings</p>

              <ul>
                <li>
                  <NavLink to="/settings/payouts" className={Styles.link}>
                    Payout History
                  </NavLink>
                </li>
              </ul>
            </div>
          </>
        )}

        {/* 🔒 Privacy */}
        <div className={Styles.card}>
          <h3>🔒 Privacy & Security</h3>
          <p>Account security controls</p>

          <ul>
            <li>
              <NavLink to="/settings/security" className={Styles.link}>
                Login Activity
              </NavLink>
            </li>
            <li>
              <NavLink to="/settings/sessions" className={Styles.link}>
                Active Sessions
              </NavLink>
            </li>
          </ul>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Settings;
