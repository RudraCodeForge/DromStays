import { useEffect, useState } from "react";
import Styles from "../../styles/ActiveSessions.module.css";
import Session from "./Session.jsx";
import {
    Get_Active_Sessions,
    Logout_Session,
    Logout_All_Sessions,
} from "../../services/Session.service";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";

const ActiveSessions = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const res = await Get_Active_Sessions();
            // 🔥 backend se hi isCurrent aa raha hai
            setSessions(res);
        } catch (error) {
            console.error("Error fetching sessions", error);
        } finally {
            setLoading(false);
        }
    };

    // 🔐 Logout single session
    const handleLogoutSession = async (sessionId, isCurrent) => {
        try {
            await Logout_Session(sessionId);

            if (isCurrent) {
                // 🔥 CURRENT DEVICE → FULL LOGOUT
                dispatch(logout());
                navigate("/login");
            } else {
                // ✅ OTHER DEVICE → ONLY REMOVE FROM LIST
                setSessions((prev) =>
                    prev.filter((s) => s._id !== sessionId)
                );
            }
        } catch (error) {
            console.error("Error logging out session", error);
        }
    };

    // 🔥 Logout from all devices
    const handleLogoutAll = async () => {
        try {
            await Logout_All_Sessions();
            dispatch(logout());
            navigate("/login");
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
                            onLogout={() =>
                                handleLogoutSession(
                                    session._id,
                                    session.isCurrent
                                )
                            }
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ActiveSessions;
