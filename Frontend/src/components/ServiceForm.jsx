import styles from "../styles/Services.module.css";
import { useState } from "react";
import { AddServices } from "../services/Partner.service";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Popup from "./Popup";
import { serviceCatalog } from "../data/serviceCatalog";

const ServiceForm = ({ isDrawerOpen, setIsDrawerOpen }) => {
  const { partner } = useSelector((state) => state.partner || {});
  const navigate = useNavigate();

  const [availableServices, setAvailableServices] = useState([]);
  const [popupData, setPopupData] = useState({
    open: false,
    title: "",
    message: "",
    type: "warning",
  });
  const [formData, setFormData] = useState({
    serviceName: "",
    category: "",
    description: "",
    coverImage: null,
    price: "",
    pricingType: "fixed",
    unit: "job",
    estimatedDuration: "",
    durationUnit: "hours",
  });

  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Category change -> Update Service List
    if (name === "category") {
      setAvailableServices(serviceCatalog[value] || []);

      setFormData((prev) => ({
        ...prev,
        category: value,
        serviceName: "",
      }));

      return;
    }

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
      setIsDrawerOpen(false);

      setFormData({
        serviceName: "",
        category: "",
        description: "",
        coverImage: null,
        price: "",
        pricingType: "fixed",
        unit: "job",
        estimatedDuration: "",
        durationUnit: "hours",
      });

      setAvailableServices([]);
    } catch (error) {
      if (error.response?.status === 409) {
        setPopupData({
          open: true,
          type: "warning",
          title: "Service Already Exists",
          message: error.response.data.message,
        });

        return;
      }

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

      <Popup
        isOpen={popupData.open}
        type={popupData.type}
        title={popupData.title}
        message={popupData.message}
        secondaryText="Close"
        secondaryClassName="close"
        onSecondaryClick={() =>
          setPopupData((prev) => ({
            ...prev,
            open: false,
          }))
        }
        onClose={() =>
          setPopupData((prev) => ({
            ...prev,
            open: false,
          }))
        }
      />
      <aside className={`${styles.drawer} ${isDrawerOpen ? styles.open : ""}`}>
        <div className={styles.drawerHeader}>
          <div className={styles.drawerTitle}>
            <h3>Add New Service</h3>
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
          {/* Category */}
          <label className={styles.formField}>
            <span>Category</span>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>

              <option value="cleaning">Cleaning</option>
              <option value="maintenance">Maintenance</option>
              <option value="guest-support">Guest Support</option>
              <option value="laundry">Laundry</option>
              <option value="electrician">Electrician</option>
              <option value="plumber">Plumber</option>
              <option value="carpenter">Carpenter</option>
              <option value="painter">Painter</option>
              <option value="ac-repair">AC Repair</option>
              <option value="helper">Helper</option>
              <option value="tiffin">Tiffin Service</option>
              <option value="other">Other</option>
            </select>
          </label>

          {/* Service Name */}
          <label className={styles.formField}>
            <span>Service Name</span>

            <select
              name="serviceName"
              value={formData.serviceName}
              onChange={handleChange}
              disabled={!formData.category}
              required
            >
              <option value="">
                {formData.category ? "Select Service" : "Select Category First"}
              </option>

              {availableServices.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </label>

          {/* Description */}
          <label className={styles.formField}>
            <span>Description</span>

            <textarea
              name="description"
              placeholder="Describe your service..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </label>

          {/* Cover Image */}
          <label className={styles.formField}>
            <span>Cover Image</span>

            <input
              type="file"
              name="coverImage"
              accept="image/*"
              onChange={handleChange}
              required
            />
          </label>

          {/* Price + Pricing Type */}
          <div className={styles.priceGrid}>
            <label className={styles.formField}>
              <span>Price (₹)</span>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter Price"
                min="0"
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
                <option value="fixed">Fixed</option>
                <option value="hourly">Hourly</option>
                <option value="starting">Starts From</option>
              </select>
            </label>
          </div>

          {/* Unit + Duration */}
          <div className={styles.priceGrid}>
            <label className={styles.formField}>
              <span>Unit</span>

              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                required
              >
                <option value="job">Per Job</option>
                <option value="hour">Per Hour</option>
                <option value="room">Per Room</option>
                <option value="home">Per Home</option>
                <option value="visit">Per Visit</option>
                <option value="day">Per Day</option>
              </select>
            </label>

            <label className={styles.formField}>
              <span>Estimated Duration</span>

              <input
                type="number"
                name="estimatedDuration"
                value={formData.estimatedDuration}
                onChange={handleChange}
                placeholder="e.g. 2"
                min="1"
                required
              />
            </label>
          </div>

          {/* Duration Unit */}
          <label className={styles.formField}>
            <span>Duration Unit</span>

            <select
              name="durationUnit"
              value={formData.durationUnit}
              onChange={handleChange}
              required
            >
              <option value="minutes">Minutes</option>
              <option value="hours">Hours</option>
              <option value="days">Days</option>
            </select>
          </label>

          <div className={styles.formActions}>
            <button type="submit">Save Service</button>
          </div>
        </form>
      </aside>
    </>
  );
};

export default ServiceForm;
