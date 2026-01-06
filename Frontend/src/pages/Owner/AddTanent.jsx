import Styles from "../../styles/AddTenant.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import ErrorContainer from "../../components/ErrorContainer";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { addTenantToRoom } from "../../services/Tenant.service";

const AddTenant = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState([]); // ✅ array based

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError([]);
    setLoading(true);

    const payload = {
      fullName: e.target.fullName.value.trim(),
      phone: e.target.phone.value.trim(),
      email: e.target.email.value || null,
      joiningDate: e.target.joiningDate.value,
      roomId,
    };

    /* 🔍 Frontend validations (array errors) */
    const errors = [];

    if (!payload.fullName) {
      errors.push("Full name is required");
    }

    if (!payload.phone) {
      errors.push("Phone number is required");
    } else if (payload.phone.length !== 10) {
      errors.push("Phone number must be exactly 10 digits");
    }

    if (!payload.joiningDate) {
      errors.push("Joining date is required");
    }

    if (errors.length > 0) {
      setError(errors);
      setLoading(false);
      return;
    }

    try {
      const data = await addTenantToRoom(payload);
      console.log("ADD TENANT RESPONSE 👉", data);

      alert("Tenant added successfully");
      navigate(-1);
    } catch (err) {
      setError(
        err?.response?.data?.errors ||
          err?.response?.data?.message || ["Failed to add tenant"]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className={Styles.container}>
        <div className={Styles.card}>
          <h2 className={Styles.heading}>Add Tenant</h2>
          <p className={Styles.subText}>
            Manually add a tenant who has joined this room.
          </p>

          {/* ❌ ERROR CONTAINER */}
          <ErrorContainer message={error} />

          <form className={Styles.form} onSubmit={handleSubmit}>
            {/* Full Name */}
            <label>
              Full Name
              <input
                type="text"
                name="fullName"
                placeholder="Enter tenant full name"
              />
            </label>

            {/* Phone */}
            <label>
              Phone Number
              <input
                type="tel"
                name="phone"
                placeholder="10 digit mobile number"
              />
            </label>

            {/* Email */}
            <label>
              Email (optional)
              <input type="email" name="email" placeholder="tenant@email.com" />
            </label>

            {/* Joining Date */}
            <label>
              Joining Date
              <input
                type="date"
                name="joiningDate"
                defaultValue={new Date().toISOString().split("T")[0]}
              />
            </label>

            {/* Actions */}
            <div className={Styles.actions}>
              <button
                type="submit"
                className={Styles.saveBtn}
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Tenant"}
              </button>

              <button
                type="button"
                className={Styles.cancelBtn}
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AddTenant;
