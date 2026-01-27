import { useNavigate } from "react-router-dom";
import Styles from "../../styles/ServerError.module.css";

const ServerError = () => {
    const navigate = useNavigate();

    return (
        <div className={Styles.wrapper}>
            <div className={Styles.card}>
                <h1 className={Styles.code}>500</h1>

                <h2 className={Styles.title}>Server Error</h2>

                <p className={Styles.message}>
                    Oops! Something went wrong on our end.
                    <br />
                    Please try again after some time.
                </p>

                <div className={Styles.actions}>
                    <button
                        className={Styles.primaryBtn}
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </button>

                    <button
                        className={Styles.secondaryBtn}
                        onClick={() => navigate("/")}
                    >
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServerError;
