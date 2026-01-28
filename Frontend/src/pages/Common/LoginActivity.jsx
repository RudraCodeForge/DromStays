import { useEffect, useState } from "react";
import Styles from "../../styles/LoginActivity.module.css";
import { Get_Login_Activities } from "../../services/RecentActivity.service.js";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
const LoginActivity = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const res = await Get_Login_Activities();
                setActivities(res.data || res);
            } catch (error) {
                console.error("Error fetching login activity", error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    if (loading) {
        return <p className={Styles.loading}>Loading login activity...</p>;
    }

    return (
        <>
            <Navbar />
            <div className={Styles.container}>
                <h2 className={Styles.heading}>Login Activity</h2>

                {activities.length === 0 ? (
                    <p className={Styles.empty}>No login activity found</p>
                ) : (
                    <table className={Styles.table}>
                        <thead>
                            <tr>
                                <th>Date & Time</th>
                                <th>Device</th>
                                <th>IP Address</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activities.map((item) => (
                                <tr key={item._id}>
                                    <td>{new Date(item.createdAt).toLocaleString()}</td>
                                    <td>{item.device || "Unknown"}</td>
                                    <td>{item.ip}</td>
                                    <td>
                                        <span
                                            className={
                                                item.status === "SUCCESS"
                                                    ? Styles.success
                                                    : Styles.failed
                                            }
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <Footer />
        </>
    );
};

export default LoginActivity;
