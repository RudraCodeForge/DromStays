import { NavLink, Link, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import Styles from "../../styles/Navbar.module.css";
import MobileNav from "./MobileNav";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import { loadUnreadCount } from "../../redux/notificationSlice";
import { FaBell } from "react-icons/fa";

const Navbar = () => {
  const { isAuthenticated, role, user } = useSelector((state) => state.auth);

  const unreadCount = useSelector(
    (state) => state.notifications?.unreadCount || 0,
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const activeClass = ({ isActive }) => (isActive ? Styles.ActiveLink : "");

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(loadUnreadCount());
    }
  }, [dispatch, isAuthenticated]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      const value = searchRef.current.value.trim();
      if (!value) return;
      navigate(`/explore_properties?location=${value}`);
    }
  };

  const handleNearMe = () => {
    if (!navigator.geolocation) {
      toast.warning("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        navigate(
          `/explore_properties?nearby=true&lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`,
        );
      },
      () => toast.error("Location access denied"),
    );
  };

  return (
    <nav className={Styles.Navbar}>
      <Link to="/">
        <img src="/logo.png" alt="DormStays Logo" className={Styles.Logo} />
      </Link>

      {(role === "tenant" || !isAuthenticated) && (
        <div className={Styles.SearchBox}>
          <input
            ref={searchRef}
            type="text"
            placeholder="Enter City to Search..."
            className={Styles.SearchBar}
            onKeyDown={handleSearch}
          />

          <button
            type="button"
            className={Styles.NearMeBtn}
            onClick={handleNearMe}
            title="Near Me"
          >
            📍
          </button>
        </div>
      )}

      <ul className={Styles.NavLinks}>
        {/* Guest */}
        {!isAuthenticated && (
          <>
            <li>
              <NavLink to="/Login" className={activeClass}>
                Login
              </NavLink>
            </li>

            <li>
              <NavLink to="/Signup" className={activeClass}>
                Sign Up
              </NavLink>
            </li>
          </>
        )}

        {/* Admin */}
        {isAuthenticated && role === "admin" && (
          <>
            <li>
              <NavLink to="/" className={activeClass}>
                Home
              </NavLink>
            </li>

            <li>
              <NavLink to="/Contactus" className={activeClass}>
                Contact Us
              </NavLink>
            </li>

            <li>
              <NavLink to="/Aboutus" className={activeClass}>
                About Us
              </NavLink>
            </li>

            <li>
              <button onClick={handleLogout} className={Styles.LogoutBtn}>
                Logout
              </button>
            </li>
          </>
        )}

        {/* Partner */}
        {isAuthenticated && role === "partner" && (
          <>
            <li>
              <NavLink to="/Partner/dashboard" className={activeClass}>
                Dashboard
              </NavLink>
            </li>

            <li>
              <NavLink to="/Partner/orders" className={activeClass}>
                Orders
              </NavLink>
            </li>

            <li>
              <NavLink to="/Partner/Services" className={activeClass}>
                Services
              </NavLink>
            </li>

            <li>
              <NavLink to="/Settings" className={activeClass}>
                Settings
              </NavLink>
            </li>

            <li>
              <div
                className={Styles.NotificationIcon}
                onClick={() => navigate("/notifications")}
              >
                <FaBell />
                {unreadCount > 0 && (
                  <span className={Styles.NotificationBadge}>
                    {unreadCount}
                  </span>
                )}
              </div>
            </li>

            <li>
              <NavLink to="/Profile" className={activeClass}>
                <div className={Styles.OwnerProfile}>
                  <p>
                    {user?.Name}
                    <br />
                    <span className={Styles.Role}>{role}</span>
                  </p>

                  <img
                    src={user?.ProfilePicture}
                    alt="profile"
                    className={Styles.Profile}
                  />
                </div>
              </NavLink>
            </li>
          </>
        )}
        {/* OWNER */}
        {isAuthenticated && role === "owner" && (
          <>
            <li>
              <NavLink to="/Owner/dashboard" className={activeClass}>
                Dashboard
              </NavLink>
            </li>

            <li>
              <NavLink to="/Owner/properties" className={activeClass}>
                Properties
              </NavLink>
            </li>

            <li>
              <NavLink to="/bookings" className={activeClass}>
                Bookings
              </NavLink>
            </li>

            <li>
              <NavLink to="/Settings" className={activeClass}>
                Settings
              </NavLink>
            </li>

            <li>
              <div
                className={Styles.NotificationIcon}
                onClick={() => navigate("/notifications")}
              >
                <FaBell />
                {unreadCount > 0 && (
                  <span className={Styles.NotificationBadge}>
                    {unreadCount}
                  </span>
                )}
              </div>
            </li>

            <li>
              <NavLink to="/Profile" className={activeClass}>
                <div className={Styles.OwnerProfile}>
                  <p>
                    {user?.Name}
                    <br />
                    <span className={Styles.Role}>{role}</span>
                  </p>

                  <img
                    src={user?.ProfilePicture}
                    alt="profile"
                    className={Styles.Profile}
                  />
                </div>
              </NavLink>
            </li>
          </>
        )}

        {/* TENANT */}
        {isAuthenticated && role === "tenant" && (
          <>
            <li>
              <NavLink to="/saved-rooms" className={activeClass}>
                Saved
              </NavLink>
            </li>

            <li>
              <NavLink to="/my-bookings" className={activeClass}>
                My Bookings
              </NavLink>
            </li>

            <li>
              <NavLink to="/my-requests" className={activeClass}>
                My Requests
              </NavLink>
            </li>

            <li>
              <NavLink to="/Settings" className={activeClass}>
                Settings
              </NavLink>
            </li>

            <li>
              <div
                className={Styles.NotificationIcon}
                onClick={() => navigate("/notifications")}
              >
                <FaBell />
                {unreadCount > 0 && (
                  <span className={Styles.NotificationBadge}>
                    {unreadCount}
                  </span>
                )}
              </div>
            </li>

            <li>
              <NavLink to="/Profile" className={activeClass}>
                <div className={Styles.OwnerProfile}>
                  <p>
                    {user?.Name}
                    <br />
                    <span className={Styles.Role}>{role}</span>
                  </p>

                  <img
                    src={user?.ProfilePicture}
                    alt="profile"
                    className={Styles.Profile}
                  />
                </div>
              </NavLink>
            </li>
          </>
        )}
      </ul>

      {/* MOBILE NAV */}
      <MobileNav />
    </nav>
  );
};

export default Navbar;
