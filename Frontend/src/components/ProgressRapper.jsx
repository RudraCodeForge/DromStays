import styles from "../styles/PartnerProfile.module.css";

const ProgrssRapper = ({ step }) => {
  return (
    <div className={styles.progressWrapper}>
      <div
        className={styles.progressBar}
        style={{
          width: step === 1 ? "33%" : step === 2 ? "66%" : "100%",
        }}
      />
    </div>
  );
};
export default ProgrssRapper;
