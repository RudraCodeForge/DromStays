import styles from "../../styles/Cart.module.css";
import { useState } from "react";
import Popup from "../../components/Popup";
const Address = ({ formData, setFormData }) => {
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [message, setMessage] = useState("");
  const handleInputChange = (e) => {
    setMessage("");
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Auto-fetch city and state when pincode is entered
    if (name === "pincode" && value.length === 6) {
      fetchCityAndState(value);
    }
  };
  const fetchCityAndState = async (pincode) => {
    setPincodeLoading(true);
    try {
      // Using India Post API to fetch city/state from pincode
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`,
      );
      const data = await response.json();

      if (data[0].Status === "Success" && data[0].PostOffice) {
        const postOffice = data[0].PostOffice[0];
        setFormData((prevData) => ({
          ...prevData,
          city: postOffice.District || "",
          state: postOffice.State || "",
        }));
      } else {
        setMessage("Invalid pincode. Please enter a valid pincode.");
        setFormData((prevData) => ({
          ...prevData,
          city: "",
          state: "",
        }));
      }
    } catch (error) {
      console.error("Error fetching city and state:", error);
      alert("Failed to fetch location details. Please enter manually.");
    } finally {
      setPincodeLoading(false);
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30); // Minimum 30 mins from now
    return now.toISOString().slice(0, 16);
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    // Validate form data
    if (!formData.address.trim()) {
      setMessage("Please enter your address");
      return;
    }
    if (!formData.pincode.trim() || formData.pincode.length !== 6) {
      setMessage("Please enter a valid 6-digit pincode");
      return;
    }
    if (!formData.city.trim()) {
      setMessage("Please enter your city");
      return;
    }
    if (!formData.state.trim()) {
      setMessage("Please enter your state");
      return;
    }
    if (!formData.mobileNumber.trim()) {
      setMessage("Please enter your mobile number");
      return;
    }
    if (!formData.emailId.trim()) {
      setMessage("Please enter your email ID");
      return;
    }
    if (!formData.serviceDate.trim()) {
      setMessage("Please select a service date");
      return;
    }
    if (!formData.serviceTime.trim()) {
      setMessage("Please select a service time");
      return;
    }
    // Validate mobile number format (basic validation for 10 digits)
    if (!/^\d{10}$/.test(formData.mobileNumber.replace(/[^\d]/g, ""))) {
      setMessage("Please enter a valid mobile number (10 digits)");
      return;
    }
    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailId)) {
      setMessage("Please enter a valid email address");
      return;
    }
    // Validate date and time are not in the past
    const selectedDateTime = new Date(
      `${formData.serviceDate}T${formData.serviceTime}`,
    );
    const minDateTime = new Date();
    minDateTime.setMinutes(minDateTime.getMinutes() + 30);
    if (selectedDateTime < minDateTime) {
      setMessage(
        "Please select a service date and time at least 30 minutes from now",
      );
      return;
    }
    console.log("Form Data:", formData);
    // Form is valid, you can proceed with checkout or save this data
  };
  return (
    <div className={styles.AddressContainer}>
      <p className={styles.error}>{message}</p>
      <h3 className={styles.addressTitle}>Delivery Address & Contact</h3>
      <form className={styles.AddressForm} onSubmit={handleAddressSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="address">Full Address *</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter your complete address (Street, City, State, Postal Code)"
            rows="3"
            className={styles.textarea}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="pincode">Pincode *</label>
            <input
              type="text"
              id="pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              placeholder="Enter 6-digit pincode"
              maxLength="6"
              className={styles.input}
            />
            {pincodeLoading && (
              <span className={styles.loadingText}>Fetching location...</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="city">City *</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="City will auto-fetch or enter manually"
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="state">State *</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              placeholder="State will auto-fetch or enter manually"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="mobileNumber">Mobile Number *</label>
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              placeholder="Enter 10-digit mobile number"
              maxLength="10"
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="emailId">Email ID *</label>
          <input
            type="email"
            id="emailId"
            name="emailId"
            value={formData.emailId}
            onChange={handleInputChange}
            placeholder="Enter your email address"
            className={styles.input}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="serviceDate">Service Date *</label>
            <input
              type="date"
              id="serviceDate"
              name="serviceDate"
              value={formData.serviceDate}
              onChange={handleInputChange}
              min={new Date().toISOString().split("T")[0]}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="serviceTime">Service Time *</label>
            <input
              type="time"
              id="serviceTime"
              name="serviceTime"
              value={formData.serviceTime}
              onChange={handleInputChange}
              min={getMinDateTime()}
              className={styles.input}
            />
          </div>
        </div>

        <button type="submit" className={styles.submitButton}>
          Save Address
        </button>
      </form>
    </div>
  );
};
export default Address;
