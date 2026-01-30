import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Styles from "../../styles/Notifications.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import { fetchNotifications, markNotificationAsRead } from "../../services/Notifications.service";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadNotifications = async () => {
            try {
                const data = await fetchNotifications();
                setNotifications(data);
            } catch (error) {
                console.error("Error fetching notifications", error);
            } finally {
                setLoading(false);
            }
        };

        loadNotifications();
    }, []);

    const handleClick = (notification) => {
        if (!notification.isRead) {
            markNotificationAsRead(notification._id)
                .then(() => {
                    setNotifications((prevNotifications) =>
                        prevNotifications.map((notif) =>
                            notif._id === notification._id ? { ...notif, isRead: true } : notif
                        )
                    );
                })
                .catch((error) => {
                    console.error("Error marking notification as read:", error);
                });
        }
        if (notification.redirectUrl) {
            navigate(notification.redirectUrl);
        }
    };

    return (
        <>
            <Navbar />

            <div className={Styles.container}>
                <h1 className={Styles.heading}>Notifications</h1>

                {loading && <p>Loading notifications...</p>}

                {!loading && notifications.length === 0 && (
                    <p className={Styles.empty}>No notifications found</p>
                )}

                {!loading && notifications.length > 0 && (
                    <ul className={Styles.list}>
                        {notifications.map((notification) => (
                            <li
                                key={notification._id}
                                className={`${Styles.item} ${!notification.isRead ? Styles.unread : ""
                                    }`}
                                onClick={() => handleClick(notification)}
                            >
                                <div className={Styles.content}>
                                    <h4>{notification.title}</h4>
                                    <p>{notification.message}</p>
                                </div>

                                <span className={Styles.time}>
                                    {new Date(notification.createdAt).toLocaleString()}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <Footer />
        </>
    );
};

export default Notifications;
