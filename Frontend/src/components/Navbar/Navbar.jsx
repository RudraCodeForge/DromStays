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

  // 🔔 unread notifications count
  const unreadCount = useSelector(
    (state) => state.notifications?.unreadCount || 0
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  /* 🔔 LOAD UNREAD COUNT ON MOUNT */
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(loadUnreadCount());
    }
  }, [dispatch, isAuthenticated]);

  /* 🔓 LOGOUT */
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  /* 🔍 SEARCH */
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      const value = searchRef.current.value.trim();
      if (!value) return;
      navigate(`/explore_properties?location=${value}`);
    }
  };

  /* 📍 NEAR ME */
  const handleNearMe = () => {
    if (!navigator.geolocation) {
      toast.warning("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        navigate(`/explore_properties?nearby=true&lat=${lat}&lng=${lng}`);
      },
      () => toast.error("Location access denied")
    );
  };

  return (
    <nav className={Styles.Navbar}>
      {/* LOGO */}
      <Link to="/">
        <img src="/logo.png" alt="DormStays Logo" className={Styles.Logo} />
      </Link>

      {/* SEARCH BAR (Guest / Tenant) */}
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

      {/* DESKTOP MENU */}
      <ul className={Styles.NavLinks}>
        {/* GUEST */}
        {!isAuthenticated && (
          <>
            <li><NavLink to="/Login">Login</NavLink></li>
            <li><NavLink to="/Signup">Sign Up</NavLink></li>
          </>
        )}

        {/* ADMIN */}
        {isAuthenticated && role === "admin" && (
          <>
            <li><NavLink to="/">Home</NavLink></li>
            <li><Link to="/Contactus">Contact Us</Link></li>
            <li><Link to="/Aboutus">About Us</Link></li>
            <li>
              <button onClick={handleLogout} className={Styles.LogoutBtn}>
                Logout
              </button>
            </li>
          </>
        )}

        {/* OWNER */}
        {isAuthenticated && role === "owner" && (
          <>
            <li><NavLink to="/Owner/dashboard">Dashboard</NavLink></li>
            <li><NavLink to="/Owner/properties">Properties</NavLink></li>
            <li><NavLink to="/bookings">Bookings</NavLink></li>
            <li><NavLink to="/Settings">Settings</NavLink></li>

            {/* 🔔 NOTIFICATION */}
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

            {/* PROFILE */}
            <li>
              <NavLink to="/Profile">
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
            <li><NavLink to="/saved-rooms">Saved</NavLink></li>
            <li><NavLink to="/my-bookings">My Bookings</NavLink></li>
            <li><NavLink to="/my-requests">My Requests</NavLink></li>
            <li><NavLink to="/Settings">Settings</NavLink></li>

            {/* 🔔 NOTIFICATION */}
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

            {/* PROFILE */}
            <li>
              <NavLink to="/Profile">
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
