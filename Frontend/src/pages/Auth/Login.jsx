import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faBed } from "@fortawesome/free-solid-svg-icons";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useEffect, useState } from "react";
import LineText from "../../components/LineText";
import Styles from "../../styles/Auth.module.css";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { loginSuccess } from "../../redux/authSlice";
import { Login as LoginService } from "../../services/auth";
import ErrorContainer from "../../components/ErrorContainer";

const Login = () => {
  const [showPass, setShowPass] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  if (isAuthenticated) {
    window.location.href = "/";
  }

  useEffect(() => {
    document.body.style.backgroundColor = "#2e126a2f";

    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(e.target);
    const user = Object.fromEntries(data.entries());

    const credentials = {
      Email: user.Email,
      Password: user.Password,
    };

    try {
      const res = await LoginService(credentials);

      console.log("LOGIN RESPONSE:", res);

      dispatch(
        loginSuccess({
          user: res.user,
          token: res.accessToken,
          role: res.user.Role.toLowerCase(),
        })
      );
      e.target.reset();
      // Redirect based on role
      if (res.user.Role.toLowerCase() === "admin") {
        window.location.href = "/";
      } else if (res.user.Role.toLowerCase() === "owner") {
        window.location.href = "/owner/dashboard";
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <>
      <div className={Styles.LoginContainer}>
        <ErrorContainer message={errorMessage} />
        <div className={Styles.LoginContent}>
          <h1>
            <FontAwesomeIcon icon={faBed} /> &nbsp; DROMESTAYS
          </h1>
          <h2>Welcome Back</h2>
          <p>Login to continue managing your steps.</p>
        </div>

        <form className={Styles.LoginForm} onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            name="Email"
            placeholder="Enter your email address"
          />

          <label>Password</label>

          {/* PASSWORD BOX WITH SHOW/HIDE ICON */}
          <div style={{ position: "relative" }}>
            <input
              type={showPass ? "text" : "password"}
              name="Password"
              placeholder="Enter your password"
              style={{ width: "100%", paddingRight: "40px" }}
            />

            <span
              onClick={() => setShowPass(!showPass)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            >
              {showPass ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <li className={Styles.Forgot}>
            <Link to="/Forgot_password">Forgot Password</Link>
          </li>

          <button type="submit" className={Styles.Login_Btn}>
            Login
          </button>
        </form>
        <LineText>OR</LineText>
        <div className={Styles.GoogleLogin}>
          <FontAwesomeIcon icon={faGoogle} />
          &nbsp; Continue with Google
        </div>
        <div className={Styles.SignupRedirect}>
          Don't have an account? &nbsp;
          <Link to="/Signup">
            <span>Sign Up</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Login;
