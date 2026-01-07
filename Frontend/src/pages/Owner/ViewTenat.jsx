import Styles from "../../styles/ViewTenant.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTenantByRoomId } from "../../services/Tenant.service";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";

const ViewTenant = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const res = await getTenantByRoomId(roomId);
        setTenants(res.tenants || []);
      } catch (err) {
        console.error("VIEW TENANTS ERROR:", err);
        setError("Failed to load tenants");
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, [roomId]);

  console.log("Tenants:", tenants);

  if (loading) {
    return <p className={Styles.loading}>Loading tenants...</p>;
  }

  if (error) {
    return <p className={Styles.error}>{error}</p>;
  }

  return (
    <>
      {" "}
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
                  className={`${Styles.status} ${
                    tenant.isActive ? Styles.active : Styles.inactive
                  }`}
                >
                  {tenant.isActive ? "Active" : "Inactive"}
                </span>

                {/* 🔜 Future buttons */}
                {/* <button>Remove</button> */}

                <div className={Styles.actions}>
                  <button
                    onClick={() => navigate(`/owner/tenant/${tenant._id}`)}
                  >
                    Delete Tenant
                  </button>
                  <button
                    onClick={() => navigate(`/owner/tenant/edit/${tenant._id}`)}
                  >
                    Edit Tenant
                  </button>
                </div>
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
