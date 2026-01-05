import { NavLink, Link } from "react-router-dom";
import Styles from "../../styles/Navbar.module.css";
import MobileNav from "./MobileNav";

import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";

const Navbar = () => {
  const { isAuthenticated, role, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    setOpen(false);
  };

  return (
    <nav className={Styles.Navbar}>
      {/* Logo */}
      <img src="/logo.png" alt="DormStays Logo" className={Styles.Logo} />

      {/* Desktop Menu */}
      <ul className={Styles.NavLinks}>
        {!isAuthenticated && (
          <>
            <li className={Styles.Login}>
              <NavLink
                to="/Login"
                className={({ isActive }) => (isActive ? Styles.active : "")}
              >
                Login
              </NavLink>
            </li>
            <li className={Styles.Signup}>
              <NavLink
                to="/Signup"
                className={({ isActive }) => (isActive ? Styles.active : "")}
              >
                Sign Up
              </NavLink>
            </li>
          </>
        )}

        {isAuthenticated && role === "admin" && (
          <>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? Styles.active : "")}
              >
                Home
              </NavLink>
            </li>
            <li>
              <Link to="/Contactus">Contact Us</Link>
            </li>
            <li>
              <Link to="/Aboutus">About Us</Link>
            </li>
            <li>
              <button onClick={handleLogout} className={Styles.LogoutBtn}>
                Logout
              </button>
            </li>
          </>
        )}

        {isAuthenticated && role === "owner" && (
          <>
            <li>
              <NavLink
                to="/Owner/dashboard"
                className={({ isActive }) => (isActive ? Styles.active : "")}
              >
                Dashboard
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/Settings"
                className={({ isActive }) => (isActive ? Styles.active : "")}
              >
                Settings
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/bookings"
                className={({ isActive }) => (isActive ? Styles.active : "")}
              >
                Bookings
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/Owner/properties"
                className={({ isActive }) => (isActive ? Styles.active : "")}
              >
                Properties
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/Profile"
                className={({ isActive }) => (isActive ? Styles.Pactive : "")}
              >
                <div className={Styles.OwnerProfile}>
                  <p>
                    {user.Name}
                    <br />
                    <span className={Styles.Role}>{role}</span>
                  </p>

                  <img
                    src={user.ProfilePicture}
                    alt="profile"
                    className={Styles.Profile}
                    width="30"
                    height="30"
                  />
                </div>
              </NavLink>
            </li>
          </>
        )}

        {isAuthenticated && role === "tenant" && (
          <>
            <NavLink to="/Profile">
              <div className={Styles.OwnerProfile}>
                <p>
                  {user.Name}
                  <br />
                  <span className={Styles.Role}>{role}</span>
                </p>

                <img
                  src="/profile.webp"
                  alt="profile"
                  className={Styles.Profile}
                  width="30"
                  height="30"
                />
              </div>
            </NavLink>
          </>
        )}
      </ul>

      <MobileNav />
    </nav>
  );
};

export default Navbar;
