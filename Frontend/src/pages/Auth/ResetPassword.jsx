import Styles from "../../styles/ResetPassword.module.css";
import ErrorContainer from "../../components/ErrorContainer";
import { useState } from "react";
import { Forget_Password } from "../../services/auth.service";

const ResetPassword = () => {
  const [errors, setErrors] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const Handle_Submit = async (e) => {
    e.preventDefault();
    setErrors(null);
    setSuccess(null);

    const email = e.target.email.value;
    setLoading(true);

    try {
      await Forget_Password(email);
      setSuccess("If the email exists, a reset link has been sent.");
      e.target.reset();
    } catch (error) {
      setErrors(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={Styles.resetPasswordContainer}>
      {errors && <ErrorContainer message={errors} />}

      {success && <div className={Styles.successMessage}>{success}</div>}

      <h2>Reset Password</h2>

      <form className={Styles.resetPasswordForm} onSubmit={Handle_Submit}>
        <label htmlFor="email">Email Address</label>

        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          required
          className={Styles.inputField}
        />

        <button
          type="submit"
          className={Styles.submitButton}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
