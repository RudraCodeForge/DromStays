import Styles from "../../styles/ChangePassword.module.css";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { useState } from "react";
import Footer from "../../components/Footer";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ErrorContainer from "../../components/ErrorContainer.jsx";
import { Update_Password } from "../../services/auth.service.js";
import { logout } from "../../redux/authSlice";

const ChangePassword = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  if (!isAuthenticated) {
    return <Navigate to="/Login" replace />;
  }
  const dispatch = useDispatch();

  const [CurrentshowPass, CurrentsetShowPass] = useState(false);
  const [NewshowPass, NewsetShowPass] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

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

  const Handle_Submit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccess("");

    const data = new FormData(e.target);
    const user = Object.fromEntries(data.entries());

    if (user.Current_Password === user.New_Password) {
      setErrors(["New password must be different from current password"]);
      return;
    }

    const passwordErrors = validatePassword(user.New_Password);
    if (passwordErrors.length > 0) {
      setErrors(passwordErrors);
      return;
    }

    try {
      setLoading(true);
      const res = await Update_Password(user);

      if (res?.success) {
        setSuccess("Password updated successfully 🎉");
        e.target.reset();
        dispatch(logout());
      } else {
        setErrors([res?.message || "Password update failed"]);
      }
    } catch (err) {
      setErrors([err.message]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className={Styles.ChangePasswordContainer}>
        <div className={Styles.Card}>
          <h2>Change Password</h2>

          <ErrorContainer message={errors} onClose={() => setErrors([])} />

          {success && <p className={Styles.SuccessMsg}>{success}</p>}

          <form className={Styles.ChangePasswordForm} onSubmit={Handle_Submit}>
            <div className={Styles.InputWrapper}>
              <input
                type={CurrentshowPass ? "text" : "password"}
                name="Current_Password"
                placeholder="Current Password"
                required
              />
              <span
                className={Styles.EyeIcon}
                onClick={() => CurrentsetShowPass(!CurrentshowPass)}
              >
                {CurrentshowPass ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className={Styles.InputWrapper}>
              <input
                type={NewshowPass ? "text" : "password"}
                name="New_Password"
                placeholder="New Password"
                required
              />
              <span
                className={Styles.EyeIcon}
                onClick={() => NewsetShowPass(!NewshowPass)}
              >
                {NewshowPass ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ChangePassword;
