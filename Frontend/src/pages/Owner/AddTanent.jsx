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
  const [error, setError] = useState([]); // array based
  const [hasAdvance, setHasAdvance] = useState(false);

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
      advanceAmount: hasAdvance
        ? Number(e.target.advanceAmount?.value || 0)
        : 0,
    };

    /* 🔍 Frontend validations */
    const errors = [];

    if (!payload.fullName) {
      errors.push("Full name is required");
    }

    if (!payload.phone) {
      errors.push("Phone number is required");
    } else if (!/^\d{10}$/.test(payload.phone)) {
      errors.push("Phone number must be exactly 10 digits");
    }

    if (!payload.joiningDate) {
      errors.push("Joining date is required");
    }

    if (hasAdvance && payload.advanceAmount <= 0) {
      errors.push("Advance amount must be greater than 0");
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

          {/* ❌ ERRORS */}
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

            {/* 🔥 Advance Payment (Optional) */}
            <label className={Styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={hasAdvance}
                onChange={(e) => setHasAdvance(e.target.checked)}
              />
              Advance payment received
            </label>

            {hasAdvance && (
              <label>
                Advance Amount
                <input
                  type="number"
                  name="advanceAmount"
                  placeholder="Enter advance amount"
                  min="1"
                />
              </label>
            )}

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
