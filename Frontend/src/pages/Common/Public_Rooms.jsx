import Styles from "../../styles/Rooms.module.css";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import { useEffect, useState } from "react";
import { Get_Property_Rooms } from "../../services/Rooms.service";

const Public_Rooms = () => {
  const navigate = useNavigate();
  const { propertyId } = useParams();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📦 Fetch Rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await Get_Property_Rooms(propertyId);
        setRooms(data?.rooms || []);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [propertyId]);

  const getRoomImage = (room) => room.images?.[0]?.url || "/placeholder.jpg";

  return (
    <>
      <Navbar />

      {/* ⏳ LOADING */}
      {loading ? (
        <div className={Styles.noRooms}>
          <h2>Loading rooms...</h2>
        </div>
      ) : rooms.length === 0 ? (
        /* 🚫 NO ROOMS */
        <div className={Styles.noRooms}>
          <h2>No Rooms Found</h2>
          <p>In This Property There is no empty Rooms </p>
        </div>
      ) : (
        /* ✅ ROOMS LIST */
        <div className={Styles.container}>
          <div className={Styles.header}>
            <h1 className={Styles.Heading}>PROPERTY ROOMS</h1>
          </div>

          <div className={Styles.grid}>
            {rooms.map((room) => (
              <div key={room._id} className={Styles.roomCard}>
                {/* 🖼️ Image */}
                <img
                  src={getRoomImage(room)}
                  alt={room.name}
                  className={Styles.roomImage}
                />

                {/* 🏷️ Room Title */}
                <h3 className={Styles.roomName}>Room {room.roomNumber}</h3>

                {/* ℹ️ Details */}
                <p className={Styles.roomDetails}>
                  {room.roomType} • Floor {room.floor} • Capacity{" "}
                  {room.capacity}
                </p>

                {/* 💰 Pricing */}
                <p className={Styles.roomPrice}>
                  Billing: {room.pricing?.billingType || "N/A"}
                </p>

                {/* 🟢 Availability */}
                <span
                  className={
                    room.isAvailable ? Styles.available : Styles.occupied
                  }
                >
                  {room.isAvailable ? "Available" : "Occupied"}
                </span>

                <div className={Styles.cardActions}>
                  <button
                    className={Styles.editButton}
                    onClick={() => navigate(`/view-details/${room._id}`)}
                  >
                    View Details
                  </button>

                  {room.tenants.length >= room.capacity && (
                    <span className={Styles.fullBadge}>Room Full</span>
                  )}
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

export default Public_Rooms;
