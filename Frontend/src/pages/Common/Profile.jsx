import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer";
import { Navigate } from "react-router-dom";
import { logout } from "../../redux/authSlice.js";
import { SendVerificationEmail } from "../../services/auth.js";
import Style from "../../styles/Profile.module.css";
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
            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
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
        <button
          className={Style.LogoutBtn}
          onClick={() => {
            dispatch(logout());
          }}
        >
          Logout
        </button>
      </div>
      <Footer />
    </>
  );
};
export default Profile;
