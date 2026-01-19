import Styles from "../../styles/RoomDetails.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getRoomById } from "../../services/Rooms.service";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";

const RoomDetails = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.auth);

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await getRoomById(roomId);
        setRoom(res.room);
      } catch (err) {
        console.error("ROOM DETAILS ERROR:", err);
        setError("Failed to load room details");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  /* 💰 RENT CALCULATION (SAFE) */
  const getRentPerTenant = (room) => {
    const count = room.tenants?.length || 1;

    if (count > 1) {
      return room.pricing.billingType === "monthly"
        ? room.pricing.sharing.perPersonMonthlyRent
        : room.pricing.sharing.perPersonDailyRent;
    }

    return room.pricing.billingType === "monthly"
      ? room.pricing.singleOccupancy.monthlyRent
      : room.pricing.singleOccupancy.dailyRent;
  };

  if (loading) {
    return <p className={Styles.loading}>Loading room details...</p>;
  }

  if (error) {
    return <p className={Styles.error}>{error}</p>;
  }

  if (!room) {
    return <p className={Styles.error}>Room not found</p>;
  }

  return (
    <>
      <Navbar />

      <div className={Styles.container}>
        {/* 🏷️ HEADER */}
        <div className={Styles.header}>
          <h2 className={Styles.title}>Room {room.roomNumber}</h2>
          <span
            className={`${Styles.statusBadge} ${
              room.isAvailable ? Styles.available : Styles.full
            }`}
          >
            {room.isAvailable ? "Available" : "Full"}
          </span>
        </div>

        {/* 🖼️ IMAGE GALLERY */}
        <div className={Styles.gallery}>
          {room.images?.length > 0 ? (
            room.images.map((img, i) => (
              <img key={i} src={img.url} alt="room" />
            ))
          ) : (
            <p className={Styles.muted}>No images available</p>
          )}
        </div>

        {/* 📦 BASIC DETAILS */}
        <div className={Styles.card}>
          <div className={Styles.detailsGrid}>
            <div className={Styles.detailItem}>
              <span>Room Type</span>
              <p>{room.roomType}</p>
            </div>

            <div className={Styles.detailItem}>
              <span>Floor</span>
              <p>{room.floor}</p>
            </div>

            <div className={Styles.detailItem}>
              <span>Capacity</span>
              <p>{room.capacity}</p>
            </div>

            <div className={Styles.detailItem}>
              <span>Occupied</span>
              <p>{room.tenants?.length || 0}</p>
            </div>
          </div>
        </div>

        {/* 🌿 AMENITIES */}
        <div className={Styles.card}>
          <h4 className={Styles.sectionTitle}>Amenities</h4>
          {room.amenities?.length > 0 ? (
            <div className={Styles.amenities}>
              {room.amenities.map((a, i) => (
                <span key={i} className={Styles.amenity}>
                  {a}
                </span>
              ))}
            </div>
          ) : (
            <p className={Styles.muted}>No amenities listed</p>
          )}
        </div>

        {/* 📜 RULES */}
        <div className={Styles.card}>
          <h4 className={Styles.sectionTitle}>Room Rules</h4>
          {room.rules?.length > 0 ? (
            <ul className={Styles.rulesList}>
              {room.rules.map((rule, i) => (
                <li key={i} className={Styles.ruleItem}>
                  <span className={Styles.ruleDot}>•</span>
                  {rule}
                </li>
              ))}
            </ul>
          ) : (
            <p className={Styles.muted}>No specific rules mentioned</p>
          )}
        </div>

        {/* 💰 PRICING */}
        <div className={`${Styles.card} ${Styles.priceCard}`}>
          <h4 className={Styles.sectionTitle}>Rent</h4>
          <p className={Styles.price}>
            ₹{getRentPerTenant(room)}{" "}
            <span className={Styles.priceUnit}>
              / {room.pricing.billingType}
            </span>
          </p>

          <p className={Styles.muted}>
            {room.tenants.length > 1
              ? "Sharing price per tenant"
              : "Single occupancy price"}
          </p>

          {!room.isAvailable && (
            <p className={Styles.fullNote}>🚫 This room is currently full</p>
          )}
        </div>

        {/* 🔘 ACTION BUTTONS */}
        <div className={Styles.actions}>
          {/* 👑 OWNER */}
          {role === "owner" && (
            <>
              <button
                className={Styles.primaryBtn}
                onClick={() => navigate(`/Owner/add-tenant/${roomId}`)}
              >
                ➕ Add Tenant
              </button>

              <button
                className={Styles.secondaryBtn}
                onClick={() => navigate(`/Owner/edit-room/${roomId}`)}
              >
                ✏️ Edit Room
              </button>

              <button
                className={Styles.secondaryBtn}
                onClick={() => navigate(`/rooms/${roomId}/tenants`)}
              >
                👀 View Tenants
              </button>
            </>
          )}

          {/* 🙋 TENANT / USER */}
          {role !== "owner" && (
            <>
              <button
                className={Styles.primaryBtn}
                disabled={!room.isAvailable}
              >
                {room.isAvailable ? "Book / Request Room" : "Not Available"}
              </button>

              <button className={Styles.secondaryBtn}>Contact Owner</button>
              <button ClassName={Styles.Favrouties}>Add to Favourates</button>
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default RoomDetails;
