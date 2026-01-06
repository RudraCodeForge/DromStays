import Styles from "../../styles/EditRooms.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import { getRoomById, updateRoomById } from "../../services/Rooms.service";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditRooms = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  /* 🔹 Fetch Room */
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await getRoomById(roomId);
        setRoom(res.room);
      } catch (err) {
        setError("Failed to load room");
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomId]);

  /* 🔹 Submit Handler (debug mode) */
  const handleSubmit = (e) => {
    e.preventDefault();

    const amenitiesArray = e.target.amenities.value
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);

    const rulesArray = e.target.rules.value
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean);

    const payload = {
      roomNumber: e.target.roomNumber.value,
      roomType: e.target.roomType.value,
      capacity: Number(e.target.capacity.value),
      floor: Number(e.target.floor.value),
      status: e.target.status.value,
      amenities: amenitiesArray,
      rules: rulesArray,
      pricing: {
        billingType: e.target.billingType.value,
        singleOccupancy: {
          monthlyRent: Number(e.target.singleMonthlyRent.value),
          dailyRent: Number(e.target.singleDailyRent.value),
        },
        sharing: {
          perPersonMonthlyRent: Number(e.target.sharingMonthlyRent.value),
          perPersonDailyRent: Number(e.target.sharingDailyRent.value),
        },
      },
    };
    const updateRoom = async () => {
      setSaving(true);
      try {
        await updateRoomById(roomId, payload);
        navigate(-1);
      } catch (err) {
        setError("Failed to update room");
      } finally {
        setSaving(false);
      }
    };
    updateRoom();
  };

  if (loading) return <div className={Styles.center}>Loading...</div>;
  if (error) return <div className={Styles.error}>{error}</div>;

  return (
    <>
      <Navbar />

      <div className={Styles.container}>
        <h1>Edit Room</h1>

        <form className={Styles.form} onSubmit={handleSubmit}>
          {/* Room Number */}
          <label>
            Room Number
            <input name="roomNumber" defaultValue={room.roomNumber} required />
          </label>

          {/* Room Type */}
          <label>
            Room Type
            <select name="roomType" defaultValue={room.roomType}>
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Triple">Triple</option>
              <option value="Dormitory">Dormitory</option>
            </select>
          </label>

          {/* Capacity */}
          <label>
            Capacity
            <input
              type="number"
              name="capacity"
              min="1"
              defaultValue={room.capacity}
            />
          </label>

          {/* Floor */}
          <label>
            Floor
            <input
              type="number"
              name="floor"
              min="0"
              defaultValue={room.floor}
            />
          </label>

          {/* Amenities */}
          <label>
            Amenities (comma separated)
            <input
              type="text"
              name="amenities"
              placeholder="WiFi, AC, Cooler"
              defaultValue={room.amenities?.join(", ")}
            />
          </label>

          {/* Billing Type */}
          <label>
            Billing Type
            <select name="billingType" defaultValue={room.pricing?.billingType}>
              <option value="monthly">Monthly</option>
              <option value="daily">Daily</option>
            </select>
          </label>

          {/* ───── Pricing Section ───── */}
          <div className={Styles.pricingSection}>
            <h3 className={Styles.sectionTitle}>Pricing Details</h3>

            {/* Single Occupancy */}
            <label>
              Single Occupancy Monthly Rent
              <input
                type="number"
                name="singleMonthlyRent"
                min="0"
                defaultValue={room.pricing?.singleOccupancy?.monthlyRent ?? 0}
              />
            </label>

            <label>
              Single Occupancy Daily Rent
              <input
                type="number"
                name="singleDailyRent"
                min="0"
                defaultValue={room.pricing?.singleOccupancy?.dailyRent ?? 0}
              />
            </label>

            {/* Sharing */}
            <label>
              Sharing Per Person Monthly Rent
              <input
                type="number"
                name="sharingMonthlyRent"
                min="0"
                defaultValue={room.pricing?.sharing?.perPersonMonthlyRent ?? 0}
              />
            </label>

            <label>
              Sharing Per Person Daily Rent
              <input
                type="number"
                name="sharingDailyRent"
                min="0"
                defaultValue={room.pricing?.sharing?.perPersonDailyRent ?? 0}
              />
            </label>
          </div>

          {/* Rules */}
          <label>
            House Rules (comma separated)
            <textarea
              name="rules"
              rows={3}
              placeholder="No smoking, No loud music after 10 PM"
              defaultValue={room.rules?.join(", ")}
            />
          </label>

          {/* Status */}
          <label>
            Status
            <select name="status" defaultValue={room.status}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>

          {/* Actions */}
          <div className={Styles.actions}>
            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Update Room"}
            </button>

            <button
              type="button"
              className={Styles.cancel}
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </>
  );
};

export default EditRooms;
