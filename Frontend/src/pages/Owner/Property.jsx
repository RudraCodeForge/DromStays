import Styles from "../../styles/Property.module.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import { useEffect, useState } from "react";
import {
  Get_Owner_Properties,
  Delete_Property,
} from "../../services/Properties.service";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Property = () => {
  const navigate = useNavigate();
  const { role, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  const [properties, setProperties] = useState([]);

  /* 🔐 AUTH + ROLE CHECK */
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (role !== "owner") {
      navigate("/unauthorized");
    }
  }, [isAuthenticated, role, navigate]);

  /* 📦 FETCH PROPERTIES */
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await Get_Owner_Properties();
        setProperties(data.properties || []);
      } catch (error) {
        toast.error("Failed to fetch properties");
      }
    };
    fetchProperties();
  }, []);

  const getPropertyImage = (property) =>
    property.images?.[0]?.url || "/placeholder.jpg";

  /* 🗑 DELETE PROPERTY */
  const handleDeleteProperty = async (propertyId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This property will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await Delete_Property(propertyId);

      // ✅ UPDATE UI
      setProperties((prev) =>
        prev.filter((property) => property._id !== propertyId)
      );

      toast.success("Property deleted successfully");
    } catch (error) {
      toast.error("Failed to delete property");
    }
  };

  return (
    <>
      <Navbar />

      {properties.length === 0 ? (
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
            {properties.map((property) => (
              <div key={property._id} className={Styles.propertyCard}>
                {/* IMAGE */}
                <div className={Styles.imageWrapper}>
                  <img
                    src={getPropertyImage(property)}
                    alt={property.name}
                  />
                </div>

                {/* CONTENT */}
                <div className={Styles.cardContent}>
                  <div className={Styles.titleRow}>
                    <h2>{property.name}</h2>
                    <div className={Styles.rating}>
                      ⭐ {property.rating?.avgRating ?? 0}
                      <span className={Styles.reviewCount}>
                        ({property.rating?.totalReviews ?? 0})
                      </span>
                    </div>
                  </div>

                  <div className={Styles.infoRow}>
                    <span className={Styles.label}>Owner</span>
                    <span className={Styles.value}>{user?.Name}</span>
                  </div>

                  <div className={Styles.infoRow}>
                    <span className={Styles.label}>Location</span>
                    <span className={Styles.value}>
                      {property.location?.city},{" "}
                      {property.location?.area}
                    </span>
                  </div>

                  <div className={Styles.infoRow}>
                    <span className={Styles.label}>Rooms</span>
                    <span className={Styles.value}>
                      {property.totalRooms}
                    </span>
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
                        navigate(
                          `/Owner/property/${property._id}/editproperty`
                        )
                      }
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className={Styles.deleteBtn}
                      onClick={() =>
                        handleDeleteProperty(property._id)
                      }
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
