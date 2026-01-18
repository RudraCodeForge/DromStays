import Styles from "../../styles/Property.module.css";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import { useEffect, useState } from "react";
import {
  Get_Owner_Properties,
  Delete_Property,
} from "../../services/Properties.service";

const Property = () => {
  const navigate = useNavigate();
  const { role, isAuthenticated, user } = useSelector((state) => state.auth);

  const [Properties, setProperties] = useState([]); // ✅ FIX 1

  if (!isAuthenticated || role !== "owner") {
    return <Navigate to="/pagenotfound" />;
  }
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await Get_Owner_Properties();
        setProperties(data.properties); // ✅ FIX 2
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };
    fetchProperties();
  }, []);

  const getPropertyImage = (property) =>
    property.images?.[0]?.url || "/placeholder.jpg";

  const handleDeleteProperty = async (propertyId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmDelete) return;

    try {
      const res = await Delete_Property(propertyId);
      // 🟢 UI se property remove (without reload)
      setProperties((prev) =>
        prev.filter((property) => property._id !== propertyId)
      );

      alert(res.message);
    } catch (error) {
      console.error("Error deleting property:", error);
      alert("Failed to delete property");
    }
  };

  return (
    <>
      <Navbar />

      {Properties.length === 0 ? (
        /* 🚫 NO PROPERTIES */
        <div className={Styles.noProperties}>
          <h2>No Properties Found</h2>
          <p>You have not added any properties yet.</p>
          <button
            className={Styles.addFirstPropertyButton}
            onClick={() => navigate("/Owner/add-property")}
          >
            + Add Your First Property
          </button>
        </div>
      ) : (
        /* ✅ PROPERTIES LIST */
        <div className={Styles.container}>
          <div className={Styles.header}>
            <h1 className={Styles.Heading}>YOUR PROPERTIES</h1>
            <button
              className={Styles.addButton}
              onClick={() => navigate("/Owner/add-property")}
            >
              + Add New Property
            </button>
          </div>

          <div className={Styles.grid}>
            {Properties.map((property) => (
              <div key={property._id} className={Styles.propertyCard}>
                {/* IMAGE */}
                <div className={Styles.imageWrapper}>
                  <img src={getPropertyImage(property)} alt={property.name} />
                </div>

                {/* CONTENT */}
                <div className={Styles.cardContent}>
                  <div className={Styles.titleRow}>
                    <h2>{property.name}</h2>
                    <div className={Styles.rating}>
                      ⭐ {property.rating || 0}
                    </div>
                  </div>

                  <div className={Styles.infoRow}>
                    <span className={Styles.label}>Owner</span>
                    <span className={Styles.value}>{user?.Name}</span>
                  </div>

                  <div className={Styles.infoRow}>
                    <span className={Styles.label}>Location</span>
                    <span className={Styles.value}>
                      {property.location?.city}, {property.location?.area}
                    </span>
                  </div>

                  <div className={Styles.infoRow}>
                    <span className={Styles.label}>Rooms</span>
                    <span className={Styles.value}>{property.totalRooms}</span>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className={Styles.cardActions}>
                  <button
                    className={Styles.viewBtn}
                    onClick={() =>
                      navigate(`/Owner/property/${property._id}/rooms`)
                    }
                  >
                    👀 View Rooms
                  </button>

                  <div className={Styles.bottomActions}>
                    <button
                      className={Styles.editBtn}
                      onClick={() =>
                        navigate(`/Owner/property/${property._id}/editproperty`)
                      }
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className={Styles.deleteBtn}
                      onClick={() => handleDeleteProperty(property._id)}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Property;
