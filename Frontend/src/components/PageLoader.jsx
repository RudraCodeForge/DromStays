import styles from "../styles/PageLoader.module.css";

const PageLoader = ({ text = "Loading, please wait..." }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.cards}>
        <div className={styles.card}></div>
        <div className={styles.card}></div>
        <div className={styles.card}></div>
      </div>
      <p className={styles.text}>{text}</p>
    </div>
  );
};

export default PageLoader;
