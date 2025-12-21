import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer";
import { Navigate } from "react-router-dom";
import { logout } from "../../redux/authSlice.js";
import { SendVerificationEmail } from "../../services/auth.js";
import Style from "../../styles/Profile.module.css";
import { NavLink } from "react-router-dom";
import { useState, useRef } from "react";
import { uploadImageToCloudinary } from "../../services/Cloudinary.js";
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

  const [preview, setPreview] = useState(user?.ProfilePicture);
  const fileInputRef = useRef(null);

  const UpdateProfile = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const url = await uploadImageToCloudinary(file);
      console.log("Cloudinary URL:", url);

      setPreview(url); // 🔥 IMPORTANT

      alert("Image uploaded successfully!");
    } catch (err) {
      console.error(err.message);
      alert(err.message);
    }
  };

  return (
    <>
      <Navbar />

      <div className={Style.ProfileContainer}>
        <div className={Style.ProfileHeader}>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            hidden
          />

          <img
            onClick={UpdateProfile}
            src={preview}
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
