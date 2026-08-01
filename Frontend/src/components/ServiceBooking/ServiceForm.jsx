import styles from "../../styles/BookServices/BookServices.module.css";
import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faCalendarDays,
  faClock,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { faAngellist } from "@fortawesome/free-brands-svg-icons";
import { SearchServices } from "../../services/ServiceApi.service";
const ServiceForm = () => {
  const formRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const currentTime = new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(formRef.current));
    setIsSubmitting(true);
    try {
      const response = await SearchServices(data);
      console.log("Search Response:", response);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error searching services:", error);
      setIsSubmitting(false);
    }
  };
  return (
    <div className={styles.SearchServicesCon}>
      <form ref={formRef} className={styles.SearchForm} onSubmit={handleSubmit}>
        {/* Service */}
        <label className={styles.Label} htmlFor="service">
          <FontAwesomeIcon className={styles.Icons} icon={faAngellist} />

          <div>
            <span className={styles.FromSpan}>Services</span>

            <select
              id="service"
              name="service"
              className={styles.Select}
              defaultValue="cleaning"
            >
              <option value="cleaning">Cleaning</option>
              <option value="plumbing">Plumbing</option>
              <option value="electrical">Electrical</option>
              <option value="painting">Painting</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </label>

        {/* Location */}
        <label className={styles.Label} htmlFor="location">
          <FontAwesomeIcon className={styles.Location} icon={faLocationDot} />

          <div>
            <span className={styles.FromSpan}>Location</span>

            <input
              type="text"
              id="location"
              name="location"
              className={styles.Input}
              defaultValue="me"
              placeholder="Enter location"
            />
          </div>
        </label>

        {/* Date */}
        <label className={styles.Label} htmlFor="date">
          <FontAwesomeIcon className={styles.Icons} icon={faCalendarDays} />

          <div>
            <span className={styles.FromSpan}>Date</span>

            <input
              type="date"
              id="date"
              name="date"
              className={styles.Input}
              min={today}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
            />
          </div>
        </label>

        {/* Time */}
        <label className={styles.Label} htmlFor="time">
          <FontAwesomeIcon className={styles.Icons} icon={faClock} />

          <div>
            <span className={styles.FromSpan}>Time</span>

            <input
              type="time"
              id="time"
              name="time"
              className={styles.Input}
              min={selectedDate === today ? currentTime : undefined}
              required
            />
          </div>
        </label>

        <button type="submit" disabled={isSubmitting} className={styles.Button}>
          {isSubmitting ? (
            <>
              Submitting
              <span className={styles.loadingDots}>
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
              <span> Search Services</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
export default ServiceForm;
