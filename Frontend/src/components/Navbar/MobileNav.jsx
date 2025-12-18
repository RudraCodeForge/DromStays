import { useState } from "react";
import Logo from "../Logo";
import { Link } from "react-router-dom";
import Styles from "../../styles/Navbar.module.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";

const MobileNav = () => {
  const [open, setOpen] = useState(false);

  const { isAuthenticated, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    setOpen(false);
  };

  return (
    <>
      {/* Hamburger Icon (Mobile) */}
      <div className={Styles.Hamburger} onClick={() => setOpen(true)}>
        <GiHamburgerMenu size={26} />
      </div>

      {/* Mobile Menu */}
      <div className={`${Styles.MobileMenu} ${open ? Styles.ShowMenu : ""}`}>
        <div className={Styles.MobileHeader}>
          <Logo fill="#2e126a" />
          <AiOutlineClose
            size={28}
            onClick={() => setOpen(false)}
            className={Styles.CloseIcon}
          />
        </div>

        <ul className={Styles.MobileNavLinks}>
          {/* NOT LOGGED IN */}
          {!isAuthenticated && (
            <>
              <li>
                <Link to="/Login" onClick={() => setOpen(false)}>
                  Login
                </Link>
              </li>
              <li>
                <Link to="/Signup" onClick={() => setOpen(false)}>
                  Sign Up
                </Link>
              </li>
            </>
          )}

          {/* ADMIN */}
          {isAuthenticated && role === "admin" && (
            <>
              <li>
                <Link to="/" onClick={() => setOpen(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/Contactus" onClick={() => setOpen(false)}>
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/Aboutus" onClick={() => setOpen(false)}>
                  About
                </Link>
              </li>
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
              <li>
                <Link to="/owner/dashboard" onClick={() => setOpen(false)}>
                  Owner Dashboard
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className={Styles.LogoutBtn}>
                  Logout
                </button>
              </li>
            </>
          )}

          {/* TENANT */}
          {isAuthenticated && role === "tenant" && (
            <>
              <li>
                <Link to="/tenant/dashboard" onClick={() => setOpen(false)}>
                  Tenant Dashboard
                </Link>
              </li>
              <li>
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
