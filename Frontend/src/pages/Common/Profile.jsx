import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer";
import { Navigate } from "react-router-dom";
import { logout } from "../../redux/authSlice.js";
import { SendVerificationEmail } from "../../services/auth.js";
import Style from "../../styles/Profile.module.css";
import { NavLink } from "react-router-dom";
const Profile = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  if (!isAuthenticated) {
    return <Navigate to="/Login" replace />;
  }

  const HandleVerify = async () => {
    try {
      const res = await SendVerificationEmail();
      alert(res.message);
    } catch (err) {
      alert(err.message);
    }
  };
  return (
    <>
      <Navbar />

      <div className={Style.ProfileContainer}>
        <div className={Style.ProfileHeader}>
          <img
            src={user?.ProfilePicture}
            alt="Profile"
            className={Style.ProfileImg}
          />
          <div className={Style.ProfileInfo}>
            <h2>{user?.Name}</h2>
            <p>{user?.Role}</p>
            <p>{user.Role === "owner" ? "Basic" : ""}</p>
            {user?.isVerified ? (
              <p className={Style.Verified}>Verified</p>
            ) : (
              <div className={Style.NotVerified}>
                <p>Not Verified</p>
                <button className={Style.VerifyBtn} onClick={HandleVerify}>
                  Verify Your Account
                </button>
              </div>
            )}
          </div>
        </div>
        <div className={Style.DetailsSection}>
          <h3>Profile Details</h3>
          <div className={Style.DetailItem}>
            <strong>Email:</strong> {user?.Email}
          </div>
          <div className={Style.DetailItem}>
            <strong>Phone:</strong> {user?.Phone || "N/A"}
          </div>
          <div className={Style.DetailItem}>
            <strong>Address:</strong>{" "}
            {user?.Address && Object.values(user.Address).some((v) => v)
              ? [
                  user.Address.houseNo,
                  user.Address.street,
                  user.Address.locality,
                  user.Address.city,
                  user.Address.state,
                  user.Address.pincode && `- ${user.Address.pincode}`,
                ]
                  .filter(Boolean)
                  .join(", ")
              : "N/A"}
          </div>
        </div>
        <div className={Style.LinkSection}>
          <NavLink to="/EditProfile" className={Style.EditLink}>
            Edit Profile
          </NavLink>
          <NavLink to="/ChangePassword" className={Style.EditLink}>
            Change Password
          </NavLink>
          <NavLink to="/Subscriptions" className={Style.EditLink}>
            Subscriptions
          </NavLink>

          <button
            className={Style.LogoutBtn}
            onClick={() => {
              dispatch(logout());
            }}
          >
            Logout
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default Profile;
