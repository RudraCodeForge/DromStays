import Styles from "../../styles/PayoutPreference.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
const PayoutPreference = () => {
    return (
        <><Navbar />
            <div className={Styles.container}>
                <h2 className={Styles.title}>Payout Preference</h2>
                <p className={Styles.subtitle}>
                    Choose how you want to receive your payouts
                </p>

                <div className={Styles.options}>
                    {/* Bank Transfer */}
                    <div className={`${Styles.card} ${Styles.active}`}>
                        <h3>🏦 Bank Transfer</h3>
                        <p>Receive payouts directly to your bank account</p>
                        <span className={Styles.badge}>Default</span>
                    </div>

                    {/* UPI */}
                    <div className={Styles.card}>
                        <h3>📱 UPI</h3>
                        <p>Fast payouts using your UPI ID</p>
                        <span className={Styles.comingSoon}>Coming Soon</span>
                    </div>

                    {/* Wallet */}
                    <div className={Styles.card}>
                        <h3>👛 Wallet</h3>
                        <p>Store payouts in your internal wallet</p>
                        <span className={Styles.comingSoon}>Coming Soon</span>
                    </div>
                </div>

                <button className={Styles.saveBtn} disabled>
                    Save Preference
                </button>
            </div>
            <Footer /></>
    );
};

export default PayoutPreference;
