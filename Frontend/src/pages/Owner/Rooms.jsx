import Styles from "../../styles/Rooms.module.css";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import { useEffect, useState } from "react";
import { Get_Owner_Rooms } from "../../services/Rooms";

const Rooms = () => {
  const navigate = useNavigate();
  const { role, isAuthenticated } = useSelector((state) => state.auth);
  const { propertyId } = useParams();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔐 Auth Guard
  if (!isAuthenticated || role !== "owner") {
    return <Navigate to="/pagenotfound" />;
  }

  // 📦 Fetch Rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await Get_Owner_Rooms(propertyId);
        setRooms(data?.rooms || []);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [propertyId]);

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
          <p>You have not added any rooms for this property yet.</p>
          <button
            className={Styles.addFirstRoomButton}
            onClick={() =>
              navigate(
                `/add-room${propertyId ? `?propertyId=${propertyId}` : ""}`
              )
            }
          >
            + Add Your First Room
          </button>
        </div>
      ) : (
        /* ✅ ROOMS LIST */
        <div className={Styles.container}>
          <div className={Styles.header}>
            <h1 className={Styles.Heading}>PROPERTY ROOMS</h1>
            <button
              className={Styles.addButton}
              onClick={() =>
                navigate(
                  `/add-room${propertyId ? `?propertyId=${propertyId}` : ""}`
                )
              }
            >
              + Add New Room
            </button>
          </div>

          <div className={Styles.grid}>
            {rooms.map((room) => (
              <div key={room._id} className={Styles.roomCard}>
                {/* 🖼️ Image */}
                <img
                  src="/default-room.jpg"
                  alt={`Room ${room.roomNumber}`}
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

                {/* ✏️ Edit */}
                <button
                  className={Styles.editButton}
                  onClick={() => navigate(`/edit-room/${room._id}`)}
                >
                  Edit Room
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Rooms;
