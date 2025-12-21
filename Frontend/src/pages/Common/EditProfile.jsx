import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import Style from "../../styles/EditProfile.module.css";
//import { updateUser } from "../../redux/authSlice";
import { updateProfileApi } from "../../services/user"; // backend later

const EditProfile = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/Login" replace />;
  }

  // 🔹 Local editable state (IMPORTANT)
  const [formData, setFormData] = useState({
    Name: user?.Name || "",
    Phone: user?.Phone || "",
    Role: user?.Role || "",
    Gender: user?.Gender || "",
    Address: {
      houseNo: user?.Address?.houseNo || "",
      street: user?.Address?.street || "",
      locality: user?.Address?.locality || "",
      city: user?.Address?.city || "",
      state: user?.Address?.state || "",
      pincode: user?.Address?.pincode || "",
    },
  });

  // 🔹 Normal fields handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔹 Address handler
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      Address: {
        ...prev.Address,
        [name]: value,
      },
    }));
  };

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 🔜 backend later
      const data = await updateProfileApi(formData);
      console.log("API Response:", data);
      //dispatch(updateUser(formData)); // Redux update
      alert("Profile updated successfully");
      navigate("/Profile");
    } catch (err) {
      alert("Profile update failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className={Style.Container}>
        <h2>Edit Profile</h2>

        <form onSubmit={handleSubmit} className={Style.Form}>
          {/* BASIC INFO */}
          <h3>Basic Information</h3>

          <input
            name="Name"
            value={formData.Name}
            onChange={handleChange}
            placeholder="Full Name"
          />

          <small>Email & role can’t be changed</small>

          <input value={user.Email} disabled />

          <input
            name="Phone"
            value={formData.Phone}
            onChange={handleChange}
            placeholder="Phone Number"
            required
          />

          <input value={formData.Role} disabled />

          <select
            name="Gender"
            value={formData.Gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          {/* ADDRESS */}
          <h3>Address Details</h3>

          <input
            name="houseNo"
            value={formData.Address.houseNo}
            onChange={handleAddressChange}
            placeholder="House No"
          />

          <input
            name="street"
            value={formData.Address.street}
            onChange={handleAddressChange}
            placeholder="Street"
          />

          <input
            name="locality"
            value={formData.Address.locality}
            onChange={handleAddressChange}
            placeholder="Locality"
          />

          <input
            name="city"
            value={formData.Address.city}
            onChange={handleAddressChange}
            placeholder="City"
          />

          <input
            name="state"
            value={formData.Address.state}
            onChange={handleAddressChange}
            placeholder="State"
          />

          <input
            name="pincode"
            value={formData.Address.pincode}
            onChange={handleAddressChange}
            placeholder="Pincode"
          />

          <button type="submit" className={Style.SaveBtn}>
            Save Changes
          </button>
        </form>
      </div>

      <Footer />
    </>
  );
};

export default EditProfile;
