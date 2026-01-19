import Styles from "../../styles/Property.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import { useEffect, useState } from "react";
import { Search_Properties } from "../../services/Properties.service";

const Public_Property = () => {
  const navigate = useNavigate();
  // Search Params
  const [searchParams] = useSearchParams();
  const city = searchParams.get("location");
  const nearby = searchParams.get("nearby");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const roomType = searchParams.get("roomType");
  const billingType = searchParams.get("billingType");

  // States
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);

        const hasSearch =
          (city && city.trim() !== "") ||
          nearby === "true" ||
          (lat && lng) ||
          roomType ||
          billingType;

        let data;

        if (hasSearch) {
          const queryParams = {};

          if (city) queryParams.location = city;
          if (nearby === "true") queryParams.nearby = true;
          if (lat && lng) {
            queryParams.lat = lat;
            queryParams.lng = lng;
          }
          if (roomType) queryParams.roomType = roomType;
          if (billingType) queryParams.billingType = billingType;

          data = await Search_Properties(queryParams);
        } else {
          data = await Search_Properties();
        }
        setProperties(data?.properties || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [city, nearby, lat, lng, roomType, billingType]);

  /* 🖼️ PROPERTY IMAGE */
  const getPropertyImage = (property) =>
    property?.images?.[0]?.url || "/placeholder.jpg";

  return (
    <>
      <Navbar />

      {/* ⏳ LOADING STATE */}
      {loading ? (
        <div className={Styles.noProperties}>
          <h2>Loading properties...</h2>
        </div>
      ) : properties.length === 0 ? (
        /* 🚫 NO PROPERTIES */
        <div className={Styles.noProperties}>
          <h2>No Properties Found</h2>
          <p>Currently there are no properties available</p>
        </div>
      ) : (
        /* ✅ PROPERTIES LIST */
        <div className={Styles.container}>
          <div className={Styles.grid}>
            {properties.map((property) => (
              <div key={property._id} className={Styles.propertyCard}>
                {/* 🖼️ IMAGE */}
                <div className={Styles.imageWrapper}>
                  <img
                    src={getPropertyImage(property)}
                    alt={property?.name || "Property"}
                  />
                </div>

                {/* 📄 CONTENT */}
                <div className={Styles.cardContent}>
                  <div className={Styles.titleRow}>
                    <h2>{property?.name}</h2>
                    <div className={Styles.rating}>
                      ⭐ {property?.rating || 0}
                    </div>
                  </div>

                  <div className={Styles.infoRow}>
                    <span className={Styles.label}>Location</span>
                    <span className={Styles.value}>
                      {property?.location?.city}, {property?.location?.area}
                    </span>
                  </div>

                  <div className={Styles.infoRow}>
                    <span className={Styles.label}>Total Rooms</span>
                    <span className={Styles.value}>
                      {property?.totalRooms || 0}
                    </span>
                  </div>
                </div>

                {/* 👉 ACTION */}
                <div className={Styles.cardActions}>
                  <button
                    className={Styles.viewBtn}
                    onClick={() => navigate(`/property/${property._id}/rooms`)}
                  >
                    👀 View Rooms
                  </button>
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

export default Public_Property;
