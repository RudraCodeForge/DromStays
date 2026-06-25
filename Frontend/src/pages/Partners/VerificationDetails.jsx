import { useState } from "react";
import styles from "../../styles/PartnerProfile.module.css";
import {
  validateGST,
  validateAadhaar,
  validatePAN,
} from "../../utils/partnerValidation";
import LiveSelfieCapture from "../../components/LiveSelfieCapture";

const VerificationDetails = ({ data, updateData, nextStep, prevStep }) => {
  const [errors, setErrors] = useState({});

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData({ [name]: value });

    const newErrors = { ...errors };

    if (name === "gstNumber" && value && !validateGST(value)) {
      newErrors.gstNumber = "Invalid GST number format";
    } else {
      delete newErrors.gstNumber;
    }

    if (name === "aadhaarNumber" && value && !validateAadhaar(value)) {
      newErrors.aadhaarNumber = "Aadhaar must be 12 digits";
    } else {
      delete newErrors.aadhaarNumber;
    }

    if (name === "panNumber" && value && !validatePAN(value)) {
      newErrors.panNumber = "Invalid PAN format (e.g., ABCDE1234A)";
    } else {
      delete newErrors.panNumber;
    }

    setErrors(newErrors);
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({
        ...prev,
        [name]: "File size must be less than 2 MB",
      }));

      e.target.value = "";
      return;
    }

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });

    updateData({ [name]: file });
  };

  const handleNext = (e) => {
    e.preventDefault();

    const validationErrors = {};

    if (!validateGST(data.gstNumber)) {
      validationErrors.gstNumber = "Invalid GST number format";
    }

    if (!validateAadhaar(data.aadhaarNumber)) {
      validationErrors.aadhaarNumber = "Aadhaar must be 12 digits";
    }

    if (!validatePAN(data.panNumber)) {
      validationErrors.panNumber = "Invalid PAN format";
    }

    if (!data.liveSelfie) {
      validationErrors.liveSelfie = "Live Selfie is required";
    }

    if (!data.aadhaarFront) {
      validationErrors.aadhaarFront = "Aadhaar Front is required";
    }

    if (!data.aadhaarBack) {
      validationErrors.aadhaarBack = "Aadhaar Back is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    nextStep();
  };

  return (
    <form onSubmit={handleNext} className={styles.form}>
      <div className={styles.formGroup}>
        <label>GST Number *</label>
        <input
          type="text"
          name="gstNumber"
          value={data.gstNumber}
          onChange={handleChange}
          placeholder="Enter GST number"
          required
          className={errors.gstNumber ? styles.inputError : ""}
        />
        {errors.gstNumber && (
          <span className={styles.errorText}>{errors.gstNumber}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label>Aadhaar Number *</label>
        <input
          type="text"
          name="aadhaarNumber"
          value={data.aadhaarNumber}
          onChange={handleChange}
          placeholder="Enter Aadhaar Number"
          maxLength="12"
          required
          className={errors.aadhaarNumber ? styles.inputError : ""}
        />
        {errors.aadhaarNumber && (
          <span className={styles.errorText}>{errors.aadhaarNumber}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label>PAN Number *</label>
        <input
          type="text"
          name="panNumber"
          value={data.panNumber}
          onChange={handleChange}
          placeholder="Enter PAN Number"
          maxLength="10"
          required
          className={errors.panNumber ? styles.inputError : ""}
        />
        {errors.panNumber && (
          <span className={styles.errorText}>{errors.panNumber}</span>
        )}
      </div>

      <div className={`${styles.formGroup} ${styles.fullWidth}`}>
        <label>Live Selfie *</label>

        <LiveSelfieCapture updateData={updateData} />

        {errors.liveSelfie && (
          <span className={styles.errorText}>{errors.liveSelfie}</span>
        )}

        {data.liveSelfie && (
          <span className={styles.fileInfo}>
            ✓ Selfie Captured Successfully
          </span>
        )}
      </div>

      <div className={`${styles.formGroup} ${styles.fullWidth}`}>
        <label>Aadhaar Front *</label>
        <input
          type="file"
          name="aadhaarFront"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          required
          className={errors.aadhaarFront ? styles.inputError : ""}
        />
        {errors.aadhaarFront && (
          <span className={styles.errorText}>{errors.aadhaarFront}</span>
        )}
        {data.aadhaarFront && (
          <span className={styles.fileInfo}>✓ {data.aadhaarFront.name}</span>
        )}
      </div>

      <div className={`${styles.formGroup} ${styles.fullWidth}`}>
        <label>Aadhaar Back *</label>
        <input
          type="file"
          name="aadhaarBack"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          required
          className={errors.aadhaarBack ? styles.inputError : ""}
        />
        {errors.aadhaarBack && (
          <span className={styles.errorText}>{errors.aadhaarBack}</span>
        )}
        {data.aadhaarBack && (
          <span className={styles.fileInfo}>✓ {data.aadhaarBack.name}</span>
        )}
      </div>

      <div className={styles.buttonGroup}>
        <button
          type="button"
          className={styles.secondaryBtn}
          onClick={prevStep}
        >
          Back
        </button>

        <button type="submit" className={styles.nextBtn}>
          Next →
        </button>
      </div>
    </form>
  );
};

export default VerificationDetails;
