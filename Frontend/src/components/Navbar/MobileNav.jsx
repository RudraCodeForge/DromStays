import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import Logo from "../Logo";
import Styles from "../../styles/Navbar.module.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose, AiOutlineBell } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";

const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, role, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const closeMenu = () => setOpen(false);

  const handleLogout = () => {
    dispatch(logout());
    closeMenu();
    navigate("/");
  };

  /* 📍 Near Me (mobile) */
  const handleNearMe = () => {
    closeMenu();
    navigate("/search?nearby=true");
  };

  return (
    <>
      {/* Hamburger */}
      <div className={Styles.Hamburger} onClick={() => setOpen(true)}>
        <GiHamburgerMenu size={26} />
      </div>

      {/* Mobile Menu */}
      <div className={`${Styles.MobileMenu} ${open ? Styles.ShowMenu : ""}`}>
        {/* Header */}
        <div className={Styles.MobileHeader}>
          <Logo fill="#fff" />
          <AiOutlineClose
            size={26}
            onClick={closeMenu}
            className={Styles.CloseIcon}
          />
        </div>

        <ul className={Styles.MobileNavLinks}>
          {/* GUEST */}
          {!isAuthenticated && (
            <>
              <li className={Styles.MobileLogin}>
                <NavLink to="/Login" onClick={closeMenu}>
                  Login
                </NavLink>
              </li>
              <li className={Styles.MobileSignup}>
                <NavLink to="/Signup" onClick={closeMenu}>
                  Sign Up
                </NavLink>
              </li>
            </>
          )}

          {/* AUTHENTICATED */}
          {isAuthenticated && (
            <>
              {/* PROFILE ROW */}
              <li className={Styles.MobileProfile}>
                <div className={Styles.MobileProfileRow}>
                  {/* Profile */}
                  <NavLink
                    to="/Profile"
                    onClick={closeMenu}
                    className={Styles.ProfileLink}
                  >
                    <img
                      src={user?.ProfilePicture || "/profile.webp"}
                      alt="profile"
                      className={Styles.MobileAvatar}
                    />
                    <div className={Styles.MobileProfileInfo}>
                      <p className={Styles.MobileName}>{user?.Name}</p>
                      <span className={Styles.MobileRole}>{role}</span>
                    </div>
                  </NavLink>

                  {/* Notifications */}
                  <NavLink
                    to="/notifications"
                    onClick={closeMenu}
                    className={Styles.NotificationIcon}
                  >
                    <AiOutlineBell size={20} />
                  </NavLink>
                </div>
              </li>

              {/* TENANT LINKS */}
              {role === "tenant" && (
                <>
                  <li className={Styles.MobileLink}>
                    <button
                      onClick={handleNearMe}
                      className={Styles.MobileActionBtn}
                    >
                      📍 Near Me
                    </button>
                  </li>
                  <li className={Styles.MobileLink}>
                    <NavLink to="/saved-properties" onClick={closeMenu}>
                      Saved
                    </NavLink>
                  </li>
                  <li className={Styles.MobileLink}>
                    <NavLink to="/my-bookings" onClick={closeMenu}>
                      My Bookings
                    </NavLink>
                  </li>
                </>
              )}

              {/* OWNER LINKS */}
              {role === "owner" && (
                <>
                  <li className={Styles.MobileLink}>
                    <NavLink to="/Owner/dashboard" onClick={closeMenu}>
                      Dashboard
                    </NavLink>
                  </li>
                  <li className={Styles.MobileLink}>
                    <NavLink to="/Owner/properties" onClick={closeMenu}>
                      Properties
                    </NavLink>
                  </li>
                  <li className={Styles.MobileLink}>
                    <NavLink to="/bookings" onClick={closeMenu}>
                      Bookings
                    </NavLink>
                  </li>
                  <li className={Styles.MobileLink}>
                    <NavLink to="/Settings" onClick={closeMenu}>
                      Settings
                    </NavLink>
                  </li>
                </>
              )}

              {/* ADMIN LINKS */}
              {role === "admin" && (
                <>
                  <li className={Styles.MobileLink}>
                    <NavLink to="/" onClick={closeMenu}>
                      Home
                    </NavLink>
                  </li>
                  <li className={Styles.MobileLink}>
                    <Link to="/Contactus" onClick={closeMenu}>
                      Contact Us
                    </Link>
                  </li>
                  <li className={Styles.MobileLink}>
                    <Link to="/Aboutus" onClick={closeMenu}>
                      About Us
                    </Link>
                  </li>
                </>
              )}

              {/* LOGOUT */}
              <li className={Styles.MobileLogout}>
                <button onClick={handleLogout} className={Styles.LogoutBtn}>
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </>
  );
};

export default MobileNav;
