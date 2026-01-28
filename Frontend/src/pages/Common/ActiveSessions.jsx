import { useEffect, useState } from "react";
import Styles from "../../styles/ActiveSessions.module.css";
import Session from "./Session.jsx";
import {
    Get_Active_Sessions,
    Logout_Session,
    Logout_All_Sessions,
} from "../../services/Session.service";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice.js";


const ActiveSessions = () => {
    const dispatch = useDispatch();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    const currentRefreshToken = localStorage.getItem("refreshToken");
    // agar refresh token cookie me hai, backend se "isCurrent" flag bhejna better hoga

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const res = await Get_Active_Sessions();

            console.log("Fetched sessions:", res);
            const updated = res.map((s) => ({
                ...s,
                isCurrent: s.refreshToken === currentRefreshToken,
            }));

            setSessions(updated);
        } catch (error) {
            console.error("Error fetching sessions", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogoutSession = async (sessionId) => {
        try {
            await Logout_Session(sessionId);
            setSessions((prev) => prev.filter((s) => s._id !== sessionId));
            dispatch(logout());
        } catch (error) {
            console.error("Error logging out session", error);
        }
    };

    const handleLogoutAll = async () => {
        try {
            await Logout_All_Sessions();
            setSessions([]);
        } catch (error) {
            console.error("Error logging out all sessions", error);
        }
    };

    if (loading) {
        return <p className={Styles.loading}>Loading active sessions...</p>;
    }

    return (
        <div className={Styles.container}>
            <div className={Styles.header}>
                <h2>Active Sessions</h2>

                {sessions.length > 1 && (
                    <button
                        className={Styles.logoutAllBtn}
                        onClick={handleLogoutAll}
                    >
                        Logout from all devices
                    </button>
                )}
            </div>

            {sessions.length === 0 ? (
                <p className={Styles.empty}>No active sessions found</p>
            ) : (
                <div className={Styles.sessionList}>
                    {sessions.map((session) => (
                        <Session
                            key={session._id}
                            session={session}
                            onLogout={handleLogoutSession}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ActiveSessions;
