import Styles from "../styles/LineText.module.css";
const LineText = ({ children }) => {
  return <div className={Styles.wrapper}>{children}</div>;
};

export default LineText;
