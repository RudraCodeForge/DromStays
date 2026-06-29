import styles from "../../styles/Services.module.css";
import FilterBar from "./FilterBar";
import ServiceCard from "./ServiceCard";
const ServiceContainer = ({ Status, setStatus, trial, setIsDrawerOpen }) => {
  return (
    <>
      <div className={styles.Header}>
        <div className={styles.Contant}>
          <h2>Manage Services</h2>
          <p>Manage your all Services here...</p>
        </div>
        <button
          type="button"
          className={styles.Button}
          onClick={() => setIsDrawerOpen(true)}
        >
          Add Services
        </button>
      </div>
      <FilterBar status={Status} setStatus={setStatus} />
      <ServiceCard Status={Status} trial={trial} />
    </>
  );
};
export default ServiceContainer;
