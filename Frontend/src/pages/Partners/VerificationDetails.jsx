import { useState } from "react";
import styles from "../../styles/PartnerProfile.module.css";
import {
  validateGST,
  validateAadhaar,
  validatePAN,
} from "../../utils/partnerValidation";
import LiveSelfieCapture from "../../components/LiveSelfieCapture";

const VerificationDetails = ({
  data,
  mode,
  profile,
  updateData,
  nextStep,
  prevStep,
  submitVerification,
}) => {
  const [errors, setErrors] = useState({});
  const isEdit = mode === "edit";

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

  const handleNext = async (e) => {
    e.preventDefault();

    const validationErrors = {};

    // GST
    if (!validateGST(data.gstNumber || profile?.verification?.gstno)) {
      validationErrors.gstNumber = "Invalid GST number format";
    }

    // Aadhaar
    if (
      !validateAadhaar(data.aadhaarNumber || profile?.verification?.addharno)
    ) {
      validationErrors.aadhaarNumber = "Aadhaar must be 12 digits";
    }

    // PAN
    if (!validatePAN(data.panNumber || profile?.verification?.panNo)) {
      validationErrors.panNumber = "Invalid PAN format";
    }

    // Create Mode
    if (!isEdit) {
      if (!data.liveSelfie) {
        validationErrors.liveSelfie = "Live Selfie is required";
      }

      if (!data.aadhaarFront) {
        validationErrors.aadhaarFront = "Aadhaar Front is required";
      }

      if (!data.aadhaarBack) {
        validationErrors.aadhaarBack = "Aadhaar Back is required";
      }
    }

    // Edit Mode
    else {
      if (!data.liveSelfie && !profile?.verification?.liveSelfieUrl) {
        validationErrors.liveSelfie = "Live Selfie is required";
      }

      if (!data.aadhaarFront && !profile?.verification?.aadhaarFrontUrl) {
        validationErrors.aadhaarFront = "Aadhaar Front is required";
      }

      if (!data.aadhaarBack && !profile?.verification?.aadhaarBackUrl) {
        validationErrors.aadhaarBack = "Aadhaar Back is required";
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (isEdit) {
      await submitVerification();
    } else {
      nextStep();
    }
  };

  return (
    <form onSubmit={handleNext} className={styles.form}>
      <div className={styles.formGroup}>
        <label>GST Number *</label>
        <input
          type="text"
          name="gstNumber"
          value={data.gstNumber || profile?.verification?.gstno || ""}
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
          value={data.aadhaarNumber || profile?.verification?.addharno || ""}
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
          value={data.panNumber || profile?.verification?.panNo || ""}
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

      {isEdit && profile?.verification?.liveSelfieUrl && (
        <div className={styles.previewImage}>
          <p>Current Selfie</p>
          <img
            width="100%"
            src={profile.verification.liveSelfieUrl}
            alt="Selfie"
            className={styles.previewImg}
          />
        </div>
      )}

      <div className={`${styles.formGroup} ${styles.fullWidth}`}>
        <label>Aadhaar Front *</label>
        <input
          type="file"
          name="aadhaarFront"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          required={!isEdit}
          className={errors.aadhaarFront ? styles.inputError : ""}
        />
        {errors.aadhaarFront && (
          <span className={styles.errorText}>{errors.aadhaarFront}</span>
        )}
        {data.aadhaarFront && (
          <span className={styles.fileInfo}>✓ {data.aadhaarFront.name}</span>
        )}
      </div>

      {isEdit && profile?.verification?.aadhaarFrontUrl && (
        <div className={styles.previewImage}>
          <p>Current Aadhaar Front</p>
          <img
            width="100%"
            src={profile.verification.aadhaarFrontUrl}
            alt="Aadhaar Front"
            className={styles.previewImg}
          />
        </div>
      )}

      <div className={`${styles.formGroup} ${styles.fullWidth}`}>
        <label>Aadhaar Back *</label>
        <input
          type="file"
          name="aadhaarBack"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          required={!isEdit}
          className={errors.aadhaarBack ? styles.inputError : ""}
        />
        {errors.aadhaarBack && (
          <span className={styles.errorText}>{errors.aadhaarBack}</span>
        )}
        {data.aadhaarBack && (
          <span className={styles.fileInfo}>✓ {data.aadhaarBack.name}</span>
        )}
      </div>

      {isEdit && profile?.verification?.aadhaarBackUrl && (
        <div className={styles.previewImage}>
          <p>Current Aadhaar Back</p>
          <img
            width="100%"
            src={profile.verification.aadhaarBackUrl}
            alt="Aadhaar Back"
            className={styles.previewImg}
          />
        </div>
      )}

      <div className={styles.buttonGroup}>
        <button
          type="button"
          className={styles.secondaryBtn}
          onClick={prevStep}
        >
          Back
        </button>

        <button type="submit" className={styles.nextBtn}>
          {isEdit ? "Re-submit Verification" : "Next →"}
        </button>
      </div>
    </form>
  );
};

export default VerificationDetails;
