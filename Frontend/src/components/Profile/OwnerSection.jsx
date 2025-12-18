import Styles from "../../styles/Profile.module.css";
const OwnerSection = () => (
  <>
    <div className={Styles.card + " " + Styles.subscription}>
      <div>
        <h3>Premium Plan</h3>
        <p>Valid till 12 Dec 2025</p>
      </div>
      <div className={Styles.subActions}>
        <button className={Styles.outlineBtn}>History</button>
        <button className={Styles.primaryBtn}>Upgrade</button>
      </div>
    </div>
  </>
);
export default OwnerSection;
