import { useNavigate } from "react-router-dom";
import Styles from "../../styles/Support/HelpPages.module.css";

const BackButton = ({ fallback = "/help-center" }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <button className={Styles.BackBtn} onClick={handleBack}>
      ← Back
    </button>
  );
};

export default BackButton;
