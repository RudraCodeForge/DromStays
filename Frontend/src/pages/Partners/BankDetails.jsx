import { useState } from "react";
import styles from "../../styles/PartnerProfile.module.css";
import {
  getBankList,
  getBankNameByIFSC,
  validateAccountNumber,
  validateIFSC,
  validateUPI,
} from "../../utils/partnerValidation";

const BankDetails = ({ data, updateData, prevStep, submitProfile }) => {
  const [errors, setErrors] = useState({});
  const bankList = getBankList();

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData({ [name]: value });

    // Validate on change
    const newErrors = { ...errors };

    if (name === "accountNumber" && value && !validateAccountNumber(value)) {
      newErrors.accountNumber = "Account number must be 9-18 digits";
    } else {
      delete newErrors.accountNumber;
    }

    if (name === "ifscCode" && value && !validateIFSC(value)) {
      newErrors.ifscCode = "Invalid IFSC code format";
    } else {
      delete newErrors.ifscCode;
    }

    if (name === "upiId" && value && !validateUPI(value)) {
      newErrors.upiId = "Invalid UPI ID format";
    } else {
      delete newErrors.upiId;
    }

    setErrors(newErrors);

    // Auto-fill bank name from IFSC
    if (name === "ifscCode" && validateIFSC(value)) {
      const bankName = getBankNameByIFSC(value);
      if (bankName) {
        updateData({ bankName });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Final validation
    const validationErrors = {};

    if (!data.accountHolderName?.trim()) {
      validationErrors.accountHolderName = "Account holder name is required";
    }
    if (!data.bankName?.trim()) {
      validationErrors.bankName = "Bank name is required";
    }
    if (!validateAccountNumber(data.accountNumber)) {
      validationErrors.accountNumber = "Invalid account number";
    }
    if (!validateIFSC(data.ifscCode)) {
      validationErrors.ifscCode = "Invalid IFSC code";
    }
    if (data.upiId && !validateUPI(data.upiId)) {
      validationErrors.upiId = "Invalid UPI ID format";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    submitProfile();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label>Account Holder Name *</label>
        <input
          type="text"
          name="accountHolderName"
          value={data.accountHolderName}
          onChange={handleChange}
          placeholder="Enter account holder name"
          required
          className={errors.accountHolderName ? styles.inputError : ""}
        />
        {errors.accountHolderName && (
          <span className={styles.errorText}>{errors.accountHolderName}</span>
        )}
      </div>

      <div className={`${styles.formGroup} ${styles.fullWidth}`}>
        <label>Bank Name * (Auto-filled from IFSC)</label>
        <select
          name="bankName"
          value={data.bankName}
          onChange={handleChange}
          required
          className={errors.bankName ? styles.inputError : ""}
        >
          <option value="">Select Bank</option>
          {bankList.map((bank) => (
            <option key={bank} value={bank}>
              {bank}
            </option>
          ))}
        </select>
        {errors.bankName && (
          <span className={styles.errorText}>{errors.bankName}</span>
        )}
        {data.bankName && !errors.bankName && (
          <span className={styles.successText}>✓ {data.bankName}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label>Account Number * (9-18 digits)</label>
        <input
          type="text"
          name="accountNumber"
          value={data.accountNumber}
          onChange={handleChange}
          placeholder="Enter account number"
          required
          className={errors.accountNumber ? styles.inputError : ""}
        />
        {errors.accountNumber && (
          <span className={styles.errorText}>{errors.accountNumber}</span>
        )}
        {data.accountNumber && !errors.accountNumber && (
          <span className={styles.successText}>✓ Valid account number</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label>IFSC Code *</label>
        <input
          type="text"
          name="ifscCode"
          value={data.ifscCode}
          onChange={handleChange}
          placeholder="Enter IFSC code"
          maxLength="11"
          required
          className={errors.ifscCode ? styles.inputError : ""}
        />
        {errors.ifscCode && (
          <span className={styles.errorText}>{errors.ifscCode}</span>
        )}
        {data.ifscCode && !errors.ifscCode && (
          <span className={styles.successText}>✓ Valid IFSC</span>
        )}
      </div>

      <div className={`${styles.formGroup} ${styles.fullWidth}`}>
        <label>UPI ID (Optional but recommended)</label>
        <input
          type="text"
          name="upiId"
          value={data.upiId}
          onChange={handleChange}
          placeholder="username@bankname (e.g., john@ybl)"
          className={errors.upiId ? styles.inputError : ""}
        />
        {errors.upiId && (
          <span className={styles.errorText}>{errors.upiId}</span>
        )}
        {data.upiId && !errors.upiId && (
          <span className={styles.successText}>✓ Valid UPI ID</span>
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
          Submit Profile
        </button>
      </div>
    </form>
  );
};

export default BankDetails;
