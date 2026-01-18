import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer";
import { Navigate, NavLink } from "react-router-dom";
import { logout } from "../../redux/authSlice.js";
import { SendVerificationEmail } from "../../services/auth.service.js";
import Style from "../../styles/Profile.module.css";
import { useState, useRef } from "react";
import { upload_Profile_ImageToCloudinary } from "../../services/Cloudinary.service.js";
import { updateProfilePictureApi } from "../../services/user.service.js";

const Profile = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  if (!isAuthenticated) {
    return <Navigate to="/Login" replace />;
  }

  /* ------------------ VERIFY EMAIL ------------------ */
  const HandleVerify = async () => {
    try {
      const res = await SendVerificationEmail();
      alert(res.message || "Verification email sent!");
    } catch (err) {
      alert(err?.message || "Something went wrong");
    }
  };

  /* ------------------ PROFILE IMAGE ------------------ */
  const [preview, setPreview] = useState(
    user?.ProfilePicture || "/default-avatar.png"
  );
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const UpdateProfile = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ validation
    if (!file.type.startsWith("image/")) {
      return alert("Only image files are allowed");
    }
    if (file.size > 2 * 1024 * 1024) {
      return alert("Image must be under 2MB");
    }

    try {
      setUploading(true);

      const url = await upload_Profile_ImageToCloudinary(file);
      setPreview(url); // optimistic UI

      await updateProfilePictureApi({ ProfilePicture: url });
      alert("Profile picture updated successfully!");
    } catch (err) {
      alert(err?.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ------------------ ADDRESS FORMAT ------------------ */
  const formattedAddress =
    user?.Address && Object.values(user.Address).some((v) => v)
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
      : "N/A";
  return (
    <>
      <Navbar />

      <div className={Style.ProfileContainer}>
        {/* -------- HEADER -------- */}
        <div className={Style.ProfileHeader}>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            hidden
          />

          <img
            src={preview}
            alt="Profile"
            className={Style.ProfileImg}
            onClick={UpdateProfile}
            title="Click to change profile picture"
          />

          {uploading && <p className={Style.Uploading}>Uploading...</p>}

          <div className={Style.ProfileInfo}>
            <h2>{user?.Name}</h2>
            <p>{user?.Role}</p>

            <p>
              {user?.Subscription?.planName === null && user?.Role === "owner"
                ? "Not Active Subscription"
                : user.Subscription.planName}
            </p>

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

        {/* -------- DETAILS -------- */}
        <div className={Style.DetailsSection}>
          <h3>Profile Details</h3>

          <div className={Style.DetailItem}>
            <strong>Email:</strong> {user?.Email}
          </div>

          <div className={Style.DetailItem}>
            <strong>Phone:</strong> {user?.Phone || "N/A"}
          </div>

          <div className={Style.DetailItem}>
            <strong>Address:</strong> {formattedAddress}
          </div>
        </div>

        {/* -------- LINKS -------- */}
        <div className={Style.LinkSection}>
          <NavLink to="/EditProfile" className={Style.EditLink}>
            Edit Profile
          </NavLink>

          <NavLink to="/ChangePassword" className={Style.EditLink}>
            Change Password
          </NavLink>

          {user?.Role === "owner" && (
            <NavLink to="/SubscriptionPlans" className={Style.EditLink}>
              Subscriptions
            </NavLink>
          )}

          <button
            className={Style.LogoutBtn}
            onClick={() => {
              if (window.confirm("Are you sure you want to logout?")) {
                dispatch(logout());
              }
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
