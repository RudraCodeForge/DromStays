import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faBed } from "@fortawesome/free-solid-svg-icons";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useEffect, useState } from "react";
import LineText from "../../components/LineText";
import Styles from "../../styles/Auth.module.css";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginSuccess } from "../../redux/authSlice";
import { fetchCurrentUser } from "../../redux/authThunks";
import { Login as LoginService } from "../../services/auth";
import ErrorContainer from "../../components/ErrorContainer";

const Login = () => {
  const [showPass, setShowPass] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🔐 Already logged in → redirect
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // 🎨 Background
  useEffect(() => {
    document.body.style.backgroundColor = "#2e126a2f";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  // 🟢 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const data = new FormData(e.target);
    const user = Object.fromEntries(data.entries());

    const credentials = {
      Email: user.Email,
      Password: user.Password,
    };

    try {
      const res = await LoginService(credentials);

      // 🔐 Save token (important)
      localStorage.setItem("accessToken", res.accessToken);

      // 🧠 Redux basic auth state
      dispatch(
        loginSuccess({
          user: res.user,
          token: res.accessToken,
        })
      );

      // 🔁 Sync full user from backend
      dispatch(fetchCurrentUser());

      e.target.reset();

      // 🔀 Role based redirect
      if (res.user.Role === "owner") {
        navigate("/Owner/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
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
          required
        />

        <label>Password</label>

        {/* Password field */}
        <div style={{ position: "relative" }}>
          <input
            type={showPass ? "text" : "password"}
            name="Password"
            placeholder="Enter your password"
            required
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
  );
};

export default Login;
