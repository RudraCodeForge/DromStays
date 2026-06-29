import styles from "../../styles/Services.module.css";
import FilterBar from "./FilterBar";
import ServiceCard from "./ServiceCard";
import { useState } from "react";
const ServiceContainer = ({ Status, setStatus, trial, setIsDrawerOpen }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
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
      <FilterBar
        status={Status}
        setStatus={setStatus}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <ServiceCard
        Status={Status}
        trial={trial}
        searchTerm={searchTerm}
        sortBy={sortBy}
      />
    </>
  );
};
export default ServiceContainer;
