import styles from "../styles/Services.module.css";
import { useState } from "react";
import { AddServices } from "../services/Partner.service";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Popup from "./Popup";
const ServiceForm = ({ isDrawerOpen, setIsDrawerOpen }) => {
  const { partner } = useSelector((state) => state.partner || {});
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    serviceName: "",
    category: "",
    description: "",
    coverImage: null,
    price: "",
    pricingType: "",
  });

  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const SubmitHandler = async (e) => {
    e.preventDefault();

    if (!partner?.isVerified) {
      setShowPopup(true);
      return;
    }

    try {
      const res = await AddServices(formData);

      console.log(res);

      setIsDrawerOpen(false);

      setFormData({
        serviceName: "",
        category: "",
        description: "",
        coverImage: null,
        price: "",
        pricingType: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Popup
        isOpen={showPopup}
        type="warning"
        title="Verification Required"
        message="Your partner profile is not verified. Please complete your verification before adding services."
        primaryText="Complete Profile"
        secondaryText="Close"
        secondaryClassName="close"
        onPrimaryClick={() => {
          setShowPopup(false);
          navigate("/partner/profile");
        }}
        onSecondaryClick={() => setShowPopup(false)}
        onClose={() => setShowPopup(false)}
      />

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

        <form className={styles.serviceForm} onSubmit={SubmitHandler}>
          <label className={styles.formField}>
            <span>Service Name</span>
            <input
              type="text"
              name="serviceName"
              placeholder="Enter service name"
              value={formData.serviceName}
              onChange={handleChange}
              required
            />
          </label>

          <label className={styles.formField}>
            <span>Category</span>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              <option value="cleaning">Cleaning</option>
              <option value="maintenance">Maintenance</option>
              <option value="guest-support">Guest Support</option>
              <option value="other">Other</option>
            </select>
          </label>

          <label className={styles.formField}>
            <span>Description</span>
            <textarea
              name="description"
              placeholder="Describe the service"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </label>

          <label className={styles.formField}>
            <span>Cover Image</span>
            <input
              type="file"
              name="coverImage"
              accept="image/*"
              onChange={handleChange}
            />
          </label>

          <div className={styles.priceGrid}>
            <label className={styles.formField}>
              <span>Price</span>
              <input
                type="text"
                name="price"
                placeholder="Enter price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </label>

            <label className={styles.formField}>
              <span>Pricing Type</span>
              <select
                name="pricingType"
                value={formData.pricingType}
                onChange={handleChange}
                required
              >
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
    </>
  );
};

export default ServiceForm;
