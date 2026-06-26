import styles from "../../styles/Services.module.css";

const FilterBar = ({ status, setStatus }) => {
  return (
    <div className={styles.FilterNavBar}>
      {/* Search */}
      <div className={styles.searchBox}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
          />
        </svg>

        <input type="text" placeholder="Find a specific service..." />
      </div>

      {/* Status Filter */}
      <div className={styles.statusTabs}>
        <button
          className={`${styles.tab} ${status === "ALL" ? styles.active : ""}`}
          onClick={() => setStatus("ALL")}
        >
          All
        </button>

        <button
          className={`${styles.tab} ${
            status === "ACTIVE" ? styles.active : ""
          }`}
          onClick={() => setStatus("ACTIVE")}
        >
          Active
        </button>

        <button
          className={`${styles.tab} ${
            status === "INACTIVE" ? styles.active : ""
          }`}
          onClick={() => setStatus("INACTIVE")}
        >
          Inactive
        </button>
      </div>

      {/* Sort */}
      <div className={styles.sortBox}>
        <span className={styles.sortIcon}>☰</span>

        <select>
          <option>Sort by: Newest</option>
          <option>Oldest</option>
          <option>Name (A-Z)</option>
          <option>Name (Z-A)</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
