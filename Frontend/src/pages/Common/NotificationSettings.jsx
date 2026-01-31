import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import Styles from "../../styles/NotificationSettings.module.css";
import { toast } from "react-toastify";

const NotificationSettings = () => {
    const [settings, setSettings] = useState({
        payment: true,
        request: true,
        reminder: false,
        system: true,
        email: false,
    });

    const handleToggle = (key) => {
        setSettings((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const handleSave = () => {
        // 🔥 API call yahin lagegi future me
        console.log("Notification settings:", settings);
        toast.success("Notification settings updated");
    };

    return (
        <>
            <Navbar />

            <div className={Styles.container}>
                <h1>Notification Settings</h1>
                <p className={Styles.subtitle}>
                    Manage how and when you receive notifications
                </p>

                <div className={Styles.card}>
                    {/* Payment */}
                    <SettingRow
                        label="Payment Notifications"
                        desc="Get notified when payments are received or updated"
                        value={settings.payment}
                        onToggle={() => handleToggle("payment")}
                    />

                    {/* Request */}
                    <SettingRow
                        label="Request Updates"
                        desc="Notifications for room visits, maintenance & complaints"
                        value={settings.request}
                        onToggle={() => handleToggle("request")}
                    />

                    {/* Reminder */}
                    <SettingRow
                        label="Reminders"
                        desc="Rent due reminders & important alerts"
                        value={settings.reminder}
                        onToggle={() => handleToggle("reminder")}
                    />

                    {/* System */}
                    <SettingRow
                        label="System Alerts"
                        desc="App updates, security & system messages"
                        value={settings.system}
                        onToggle={() => handleToggle("system")}
                    />

                    {/* Email */}
                    <SettingRow
                        label="Email Notifications"
                        desc="Receive important notifications via email"
                        value={settings.email}
                        onToggle={() => handleToggle("email")}
                    />
                </div>

                <div className={Styles.actions}>
                    <button className={Styles.saveBtn} onClick={handleSave}>
                        Save Changes
                    </button>
                </div>
            </div>

            <Footer />
        </>
    );
};

/* 🔹 Reusable Row */
const SettingRow = ({ label, desc, value, onToggle }) => {
    return (
        <div className={Styles.row}>
            <div>
                <h4>{label}</h4>
                <p>{desc}</p>
            </div>

            <label className={Styles.switch}>
                <input type="checkbox" checked={value} onChange={onToggle} />
                <span className={Styles.slider}></span>
            </label>
        </div>
    );
};

export default NotificationSettings;
