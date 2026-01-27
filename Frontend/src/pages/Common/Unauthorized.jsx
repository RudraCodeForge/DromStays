import { useNavigate } from "react-router-dom";
import Styles from "../../styles/Unauthorized.module.css";

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className={Styles.wrapper}>
            <div className={Styles.illustration}>
                <span className={Styles.code}>403</span>
            </div>

            <h1 className={Styles.title}>You're not permitted to see this.</h1>

            <p className={Styles.subtitle}>
                The page you're trying to access has restricted access.
                <br />
                If you feel this is a mistake, contact your admin.
            </p>

            <button
                className={Styles.button}
                onClick={() => navigate("/")}
            >
                RETURN HOME
            </button>
        </div>
    );
};

export default Unauthorized;
