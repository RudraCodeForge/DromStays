import styles from "../styles/Services.module.css";

const ServiceForm = ({ isDrawerOpen, setIsDrawerOpen }) => {
  return (
    <aside className={`${styles.drawer} ${isDrawerOpen ? styles.open : ""}`}>
      <div className={styles.drawerHeader}>
        <div className={styles.drawerTitle}>
          <h3>Add New Services</h3>
          <p>Complete the form to publish a new service.</p>
        </div>
        <button
          type="button"
          className={styles.closeButton}
          onClick={() => setIsDrawerOpen(false)}
          aria-label="Close drawer"
        >
          ×
        </button>
      </div>
      <form
        className={styles.serviceForm}
        onSubmit={(e) => {
          e.preventDefault();
          setIsDrawerOpen(false);
        }}
      >
        <label className={styles.formField}>
          <span>Service Name</span>
          <input type="text" placeholder="Enter service name" required />
        </label>
        <label className={styles.formField}>
          <span>Category</span>
          <select required>
            <option value="">Select category</option>
            <option value="cleaning">Cleaning</option>
            <option value="maintenance">Maintenance</option>
            <option value="guest-support">Guest Support</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label className={styles.formField}>
          <span>Description</span>
          <textarea placeholder="Describe the service" required />
        </label>
        <label className={styles.formField}>
          <span>Cover Image</span>
          <input type="file" accept="image/*" />
        </label>
        <div className={styles.priceGrid}>
          <label className={styles.formField}>
            <span>Price</span>
            <input type="text" placeholder="Enter price" required />
          </label>
          <label className={styles.formField}>
            <span>Pricing Type</span>
            <select required>
              <option value="">Select pricing type</option>
              <option value="fixed">Fixed</option>
              <option value="per-night">Per Night</option>
              <option value="per-hour">Per Hour</option>
              <option value="custom">Custom</option>
            </select>
          </label>
        </div>
        <div className={styles.formActions}>
          <button type="submit">Save Service</button>
        </div>
      </form>
    </aside>
  );
};
export default ServiceForm;
