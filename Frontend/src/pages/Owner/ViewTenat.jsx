import Styles from "../../styles/ViewTenant.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getTenantByRoomId,
  deleteTenantById,
} from "../../services/Tenant.service";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const ViewTenant = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* 🔐 AUTH CHECK */
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (role !== "owner") {
      navigate("/unauthorized");
    }
  }, [isAuthenticated, role, navigate]);

  /* 📦 FETCH TENANTS */
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const res = await getTenantByRoomId(roomId);
        setTenants(res.tenants || []);
      } catch (err) {
        setError("Failed to load tenants");
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, [roomId]);

  /* 🗑 DELETE TENANT */
  const handleDelete = async (tenantId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This tenant will be permanently removed from the room.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteTenantById(tenantId);

      // ✅ UPDATE UI
      setTenants((prev) =>
        prev.filter((tenant) => tenant._id !== tenantId)
      );

      toast.success("Tenant deleted successfully");
    } catch (error) {
      toast.error("Failed to delete tenant");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <p className={Styles.loading}>Loading tenants...</p>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <p className={Styles.error}>{error}</p>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className={Styles.container}>
        {/* 🔙 Header */}
        <div className={Styles.header}>
          <h2 className={Styles.title}>Room Tenants</h2>
          <button className={Styles.backBtn} onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>

        {/* ❌ No tenants */}
        {tenants.length === 0 && (
          <div className={Styles.empty}>
            <p>No tenants added to this room yet.</p>
          </div>
        )}

        {/* 👥 Tenant Cards */}
        <div className={Styles.grid}>
          {tenants.map((tenant) => (
            <div key={tenant._id} className={Styles.card}>
              <div className={Styles.avatar}>
                {tenant.fullName?.charAt(0).toUpperCase()}
              </div>

              <div className={Styles.info}>
                <h4>{tenant.fullName}</h4>
                <p>{tenant.phone}</p>
                {tenant.email && <p>{tenant.email}</p>}
              </div>

              <div className={Styles.actions}>
                <span
                  className={`${Styles.status} ${tenant.isActive ? Styles.active : Styles.inactive
                    }`}
                >
                  {tenant.isActive ? "Active" : "Inactive"}
                </span>

                <button
                  className={Styles.deleteBtn}
                  onClick={() => handleDelete(tenant._id)}
                >
                  🗑 Delete
                </button>

                <button
                  className={Styles.editBtn}
                  onClick={() =>
                    navigate(`/owner/tenant/edit/${tenant._id}`)
                  }
                >
                  ✏️ Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ViewTenant;
