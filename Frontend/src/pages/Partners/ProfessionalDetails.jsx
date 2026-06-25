import styles from "../../styles/PartnerProfile.module.css";

const ProfessionalDetails = ({ data, updateData, nextStep }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData({ [name]: value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <form onSubmit={handleNext} className={styles.form}>
      <div className={styles.formGroup}>
        <label>Business Name *</label>
        <input
          type="text"
          name="businessName"
          value={data.businessName}
          onChange={handleChange}
          placeholder="Enter business name"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Contact Person *</label>
        <input
          type="text"
          name="contactPerson"
          value={data.contactPerson}
          onChange={handleChange}
          placeholder="Enter contact person name"
          required
        />
      </div>

      <div className={`${styles.formGroup} ${styles.fullWidth}`}>
        <label>Service Category *</label>
        <select
          name="serviceCategory"
          value={data.serviceCategory}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="Electrician">Electrician</option>
          <option value="Plumber">Plumber</option>
          <option value="Painter">Painter</option>
          <option value="Cleaner">Cleaner</option>
          <option value="Carpenter">Carpenter</option>
          <option value="AC Technician">AC Technician</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label>Experience (Years) *</label>
        <input
          type="number"
          name="experience"
          value={data.experience}
          onChange={handleChange}
          placeholder="e.g. 5"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Skills *</label>
        <input
          type="text"
          name="skills"
          value={data.skills}
          onChange={handleChange}
          placeholder="e.g. Wiring, Repairing"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Languages *</label>
        <input
          type="text"
          name="languages"
          value={data.languages}
          onChange={handleChange}
          placeholder="Hindi, English"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Available Working Hours *</label>
        <input
          type="text"
          name="workingHours"
          value={data.workingHours}
          onChange={handleChange}
          placeholder="9 AM - 6 PM"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>City *</label>
        <input
          type="text"
          name="city"
          value={data.city}
          onChange={handleChange}
          placeholder="Enter city"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Service Radius (KM) *</label>
        <input
          type="number"
          name="serviceRadius"
          value={data.serviceRadius}
          onChange={handleChange}
          placeholder="10"
          required
        />
      </div>

      <button type="submit" className={styles.nextBtn}>
        Next →
      </button>
    </form>
  );
};

export default ProfessionalDetails;
