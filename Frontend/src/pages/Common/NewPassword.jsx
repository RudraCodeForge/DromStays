import Styles from "../../styles/NewPassword.module.css";
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ErrorContainer from "../../components/ErrorContainer";
import { Reset_Password } from "../../services/auth.service";

const NewPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8)
      errors.push("Password must be at least 8 characters.");
    if (!/[A-Z]/.test(password))
      errors.push("At least one uppercase letter required.");
    if (!/[a-z]/.test(password))
      errors.push("At least one lowercase letter required.");
    if (!/[0-9]/.test(password)) errors.push("At least one number required.");
    if (!/[!@#$%^&*]/.test(password))
      errors.push("At least one special character required.");
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      return setError("Invalid or missing reset token.");
    }

    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      return setError(passwordErrors.join(" "));
    }

    try {
      setLoading(true);

      // 🔥 CORRECT API CALL
      await Reset_Password(token, password);

      setSuccess("Password reset successful. Redirecting to login...");
      e.target.reset();

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={Styles.container}>
      <h2 className={Styles.title}>Reset Your Password</h2>

      {error && <ErrorContainer message={error} />}
      {success && <p className={Styles.success}>{success}</p>}

      <form className={Styles.form} onSubmit={handleSubmit}>
        <div className={Styles.inputGroup}>
          <label className={Styles.label} htmlFor="password">
            New Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className={Styles.input}
            placeholder="Enter new password"
            required
          />
        </div>

        <div className={Styles.inputGroup}>
          <label className={Styles.label} htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className={Styles.input}
            placeholder="Confirm new password"
            required
          />
        </div>

        <button type="submit" className={Styles.button} disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default NewPassword;
