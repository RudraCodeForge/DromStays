import Styles from "../../styles/Session.module.css";

const Session = ({ session, onLogout }) => {
    return (
        <div className={Styles.sessionCard}>
            <div className={Styles.header}>
                <h3>{session.device || "Unknown Device"}</h3>

                {session.isCurrent && (
                    <span className={Styles.current}>This device</span>
                )}
            </div>

            <p><strong>IP:</strong> {session.ip}</p>
            <p>
                <strong>Logged In:</strong>{" "}
                {new Date(session.createdAt).toLocaleString()}
            </p>

            {!session.isCurrent && (
                <button
                    className={Styles.logoutBtn}
                    onClick={() => onLogout(session._id)}
                >
                    Logout
                </button>
            )}
        </div>
    );
};

export default Session;
