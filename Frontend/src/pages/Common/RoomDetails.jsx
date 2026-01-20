import Styles from "../../styles/RoomDetails.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { getRoomById } from "../../services/Rooms.service";
import {
  addRoomToFavourites,
  checkFavourite,
} from "../../services/Favourite.service";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import Slider from "react-slick";

const RoomDetails = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { role, isAuthenticated } = useSelector((state) => state.auth);

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  // ---------------- FETCH ROOM ----------------
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const res = await getRoomById(roomId);
        if (!res?.room) throw new Error("Room not found");
        setRoom(res.room);
      } catch (err) {
        setError(err.message || "Failed to load room");
        toast.error(err.message || "Failed to load room");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  // ---------------- CHECK FAV STATUS ----------------
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchFavStatus = async () => {
      try {
        const res = await checkFavourite(roomId);
        setIsFav(res.isFavourite);
      } catch (err) {
        console.error("Favourite check error", err);
      }
    };

    fetchFavStatus();
  }, [roomId, isAuthenticated]);

  // ---------------- RENT CALCULATION ----------------
  const rentPerTenant = useMemo(() => {
    if (!room) return 0;

    const count = room.tenants?.length || 1;
    if (count > 1) {
      return room.pricing.billingType === "monthly"
        ? room.pricing.sharing.perPersonMonthlyRent
        : room.pricing.sharing.perPersonDailyRent;
    }

    return room.pricing.billingType === "monthly"
      ? room.pricing.singleOccupancy.monthlyRent
      : room.pricing.singleOccupancy.dailyRent;
  }, [room]);

  // ---------------- TOGGLE FAV ----------------
  const handleToggleFav = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to use favourites");
      return navigate("/login");
    }

    try {
      setFavLoading(true);
      const res = await addRoomToFavourites(roomId);
      setIsFav((prev) => !prev);
      toast.success(res.message);
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setFavLoading(false);
    }
  };

  // ---------------- BOOK ----------------
  const handleBook = () => {
    if (!room.isAvailable) return;
    navigate(`/book/${roomId}`);
  };

  // ---------------- SLIDER ----------------
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  // ---------------- STATES ----------------
  if (loading)
    return (
      <div className={Styles.loading}>
        <ClipLoader size={50} color="#2e126a" />
        <p>Loading room details...</p>
      </div>
    );

  if (error) return <p className={Styles.error}>{error}</p>;
  if (!room) return <p className={Styles.error}>Room not found</p>;

  return (
    <>
      <Navbar />
      <div className={Styles.container}>
        {/* HEADER */}
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

        {/* IMAGES */}
        <div className={Styles.gallery}>
          {room.images?.length ? (
            <Slider {...sliderSettings}>
              {room.images.map((img, i) => (
                <img key={i} src={img.url} alt={`Room ${i + 1}`} />
              ))}
            </Slider>
          ) : (
            <p className={Styles.muted}>No images available</p>
          )}
        </div>

        {/* DETAILS */}
        <div className={Styles.card}>
          <div className={Styles.detailsGrid}>
            <div>
              <span>Room Type</span>
              <p>{room.roomType}</p>
            </div>
            <div>
              <span>Floor</span>
              <p>{room.floor}</p>
            </div>
            <div>
              <span>Capacity</span>
              <p>{room.capacity}</p>
            </div>
            <div>
              <span>Occupied</span>
              <p>{room.tenants?.length || 0}</p>
            </div>
          </div>
        </div>

        {/* AMENITIES */}
        <div className={Styles.card}>
          <h4>Amenities</h4>
          {room.amenities?.length ? (
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

        {/* PRICING */}
        <div className={`${Styles.card} ${Styles.priceCard}`}>
          <h4>Rent</h4>
          <p className={Styles.price}>
            ₹{rentPerTenant} <span>/ {room.pricing.billingType}</span>
          </p>
        </div>

        {/* ACTIONS */}
        {role !== "owner" && (
          <div className={Styles.actions}>
            <button
              className={Styles.primaryBtn}
              disabled={!room.isAvailable}
              onClick={handleBook}
            >
              {room.isAvailable ? "Book / Request Room" : "Not Available"}
            </button>

            <button
              className={Styles.secondaryBtn}
              onClick={() => setShowContactModal(true)}
            >
              Contact Owner
            </button>

            <button
              className={`${Styles.favBtn} ${isFav ? Styles.favActive : ""}`}
              onClick={handleToggleFav}
              disabled={favLoading}
            >
              {isFav ? "❤️ Added to Favourites" : "🤍 Add to Favourites"}
            </button>
          </div>
        )}

        {/* CONTACT MODAL */}
        {showContactModal && (
          <div className={Styles.modal}>
            <div className={Styles.modalContent}>
              <h3>Contact Owner</h3>
              <p>Email: {room.owner?.email || "N/A"}</p>
              <p>Phone: {room.owner?.phone || "N/A"}</p>
              <button onClick={() => setShowContactModal(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default RoomDetails;
