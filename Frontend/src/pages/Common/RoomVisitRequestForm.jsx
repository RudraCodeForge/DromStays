import { useRef, useState } from "react";
import Styles from "../../styles/RoomVisitForm.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import { useParams } from "react-router-dom";

const RoomVisitRequestForm = () => {
  const nameRef = useRef();
  const dateRef = useRef();
  const timeRef = useRef();
  const purposeRef = useRef();
  const messageRef = useRef();

  const params = useParams();
  const roomId = params.roomId;

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔹 Today's date (YYYY-MM-DD)
  const today = new Date().toISOString().split("T")[0];

  // 🔹 Current hour (24-hour format)
  const currentHour = new Date().getHours();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      requestType: "room_visit",
      roomId,
      name: nameRef.current.value,
      visitDate: dateRef.current.value,
      visitTimeSlot: timeRef.current.value,
      purposeOfVisit: purposeRef.current.value,
      message: messageRef.current.value,
    };

    console.log("ROOM VISIT REQUEST DATA 👉", payload);

    // fake delay (UI animation feel)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    e.target.reset();
  };

  return (
    <>
      <Navbar />

      <div className={Styles.container}>
        <form className={Styles.form} onSubmit={handleSubmit}>
          <h2 className={Styles.title}>🏠 Room Visit Request</h2>

          {/* Name */}
          <div className={Styles.field}>
            <label className={Styles.label}>Name</label>
            <input
              type="text"
              ref={nameRef}
              className={Styles.input}
              required
            />
          </div>

          {/* Date */}
          <div className={Styles.field}>
            <label className={Styles.label}>Visit Date</label>
            <input
              type="date"
              ref={dateRef}
              className={Styles.input}
              min={today}
              required
            />
          </div>

          {/* Time Slot */}
          <div className={Styles.field}>
            <label className={Styles.label}>Time Slot</label>
            <select ref={timeRef} className={Styles.select} required>
              <option value="">Select time slot</option>

              <option
                value="10 AM - 11 AM"
                disabled={dateRef.current?.value === today && currentHour >= 11}
              >
                10 AM - 11 AM
              </option>

              <option
                value="12 PM - 1 PM"
                disabled={dateRef.current?.value === today && currentHour >= 13}
              >
                12 PM - 1 PM
              </option>

              <option
                value="4 PM - 5 PM"
                disabled={dateRef.current?.value === today && currentHour >= 17}
              >
                4 PM - 5 PM
              </option>

              <option
                value="6 PM - 7 PM"
                disabled={dateRef.current?.value === today && currentHour >= 19}
              >
                6 PM - 7 PM
              </option>
            </select>
          </div>

          {/* Purpose */}
          <div className={Styles.field}>
            <label className={Styles.label}>Purpose of Visit</label>
            <input
              type="text"
              ref={purposeRef}
              className={Styles.input}
              placeholder="Parents / Guest / Inspection"
              required
            />
          </div>

          {/* Message */}
          <div className={Styles.field}>
            <label className={Styles.label}>Message</label>
            <textarea
              ref={messageRef}
              className={Styles.textarea}
              placeholder="Optional message"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`${Styles.button} ${
              isSubmitting ? Styles.submitting : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Request"}
          </button>
        </form>
      </div>

      <Footer />
    </>
  );
};

export default RoomVisitRequestForm;
