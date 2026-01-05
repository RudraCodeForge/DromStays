import Style from "../../styles/Signup.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed } from "@fortawesome/free-solid-svg-icons";
import ErrorContainer from "../../components/ErrorContainer.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Footer from "../../components/Footer.jsx";
import { Link } from "react-router-dom";
import { Signup as SignupService } from "../../services/auth.service.js";

const Signup = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    window.location.href = "/";
  }
  const [Role, setRole] = useState("");
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const errors = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long.");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter (A-Z).");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter (a-z).");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number (0-9).");
    }
    if (!/[!@#$%^&*()_\-+=<>?/{}[\]~]/.test(password)) {
      errors.push("Password must contain at least one special symbol.");
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(e.target);
    const user = Object.fromEntries(data.entries());

    const newErrors = [];

    if (!Role) newErrors.push("Please select a role.");

    // Password validation
    const passwordErrors = validatePassword(user.Password);
    if (passwordErrors.length > 0) newErrors.push(...passwordErrors);

    if (user.Phone.length !== 10 || !/^\d{10}$/.test(user.Phone)) {
      newErrors.push("Please enter a valid 10-digit phone number.");
    }

    if (user.Password !== user.ConfirmPassword) {
      newErrors.push("Passwords do not match.");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      Role,
      Name: user.Name,
      Phone: user.Phone,
      Email: user.Email,
      Password: user.Password,
      ConfirmPassword: user.ConfirmPassword,
    };

    // ------------------ BACKEND CALL FIXED ------------------ //
    try {
      const res = await SignupService(payload);
      // Clear form
      e.target.reset();
      setRole("");
      setErrors([]);
      navigate("/Login");
    } catch (error) {
      setErrors([
        error.response?.data?.message || "An error occurred during signup.",
      ]);
    }
  };

  return (
    <>
      <div className={Style.SignupContainer}>
        <div className={Style.leftSection}>
          <span className={Style.logo}>
            <FontAwesomeIcon icon={faBed} /> &nbsp; DROMESTAYS
          </span>
          <h1>Find your perfect space Today</h1>
          <p>
            Join thousands of students, owners, and partners in the most trusted
            rental community.
          </p>

          {/* Error Will Display Here */}
          <ErrorContainer message={errors} />

          <span className={Style.BottomText}>
            <p>Trusted by 2000+ community members</p>
          </span>
        </div>

        <div className={Style.rightSection}>
          <h1>Create Account</h1>
          <p>Join our community of Students, Owners, & Service Partners.</p>

          <div className={Style.RoleBox}>
            <p>I am a...</p>
            <div className={Style.Roles}>
              <button
                className={`${Style.RoleBtn} ${
                  Role === "owner" ? Style.Active : ""
                }`}
                type="button"
                onClick={() => setRole("owner")}
              >
                Owner
              </button>

              <button
                className={`${Style.RoleBtn} ${
                  Role === "tenant" ? Style.Active : ""
                }`}
                type="button"
                onClick={() => setRole("tenant")}
              >
                Tenant
              </button>

              <button
                className={`${Style.RoleBtn} ${
                  Role === "partner" ? Style.Active : ""
                }`}
                type="button"
                onClick={() => setRole("partner")}
              >
                Service Partner
              </button>
            </div>
          </div>

          <form className={Style.SignupForm} onSubmit={handleSubmit}>
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" name="Name" required />

            <label htmlFor="Phone">Phone Number</label>
            <input type="tel" id="phone" name="Phone" required />

            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" name="Email" required />

            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="Password" required />

            <label htmlFor="ConfirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="ConfirmPassword"
              required
            />

            <button type="submit" className={Style.SubmitBtn}>
              Sign Up
            </button>
          </form>

          <div className={Style.LoginRedirect}>
            Already have an account? &nbsp;
            <Link to="/Login">
              <span>Login</span>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Signup;
