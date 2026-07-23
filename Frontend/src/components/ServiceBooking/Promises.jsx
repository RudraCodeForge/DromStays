import styles from "../../styles/BookServices/BookServices.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { promiseData } from "../../data/promises";

const Promises = () => {
  return (
    <div className={styles.PromiseContainer}>
      <span className={styles.tagline}>The DromStays promise</span>
      <span className={styles.Heading}>
        Home services, made reassuringly simple.
      </span>
      <div className={styles.PromiseCardCon}>
        {promiseData.map((promise) => (
          <div key={promise.id} className={styles.PromiseCard}>
            <span className={styles.PromiseIcon}>
              <FontAwesomeIcon icon={promise.icon} />
            </span>
            <span className={styles.PromiseTitle}>{promise.title}</span>
            <span className={styles.PromiseDisc}>{promise.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Promises;
