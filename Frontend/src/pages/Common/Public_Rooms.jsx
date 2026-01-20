import Styles from "../../styles/Rooms.module.css";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import { useEffect, useState } from "react";
import { Get_Property_Rooms } from "../../services/Rooms.service";
import { getMyFavourites } from "../../services/Favourite.service";
import { useSelector } from "react-redux";

const Public_Rooms = () => {
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const isSavedRoomsPage = location.pathname === "/saved-rooms";

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📦 Fetch Rooms (Property OR Saved)
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);

        if (isSavedRoomsPage) {
          if (!isAuthenticated) {
            navigate("/login");
            return;
          }

          const res = await getMyFavourites();
          setRooms(res?.rooms || []);
        } else {
          const data = await Get_Property_Rooms(propertyId);
          setRooms(data?.rooms || []);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [propertyId, isSavedRoomsPage, isAuthenticated, navigate]);

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
          <h2>{isSavedRoomsPage ? "No Saved Rooms" : "No Rooms Found"}</h2>
          <p>
            {isSavedRoomsPage
              ? "You haven’t saved any rooms yet ❤️"
              : "In this property there are no available rooms"}
          </p>
        </div>
      ) : (
        /* ✅ ROOMS LIST */
        <div className={Styles.container}>
          <div className={Styles.header}>
            <h1 className={Styles.Heading}>
              {isSavedRoomsPage ? "SAVED ROOMS" : "PROPERTY ROOMS"}
            </h1>
          </div>

          <div className={Styles.grid}>
            {rooms.map((room) => (
              <div key={room._id} className={Styles.roomCard}>
                {/* 🖼️ Image */}
                <img
                  src={getRoomImage(room)}
                  alt={room.roomNumber}
                  className={Styles.roomImage}
                />

                {/* 🏷️ Title */}
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

                  {room.tenants?.length >= room.capacity && (
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
