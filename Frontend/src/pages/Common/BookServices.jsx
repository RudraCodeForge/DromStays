import React, { useRef, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import LineText from "../../components/LineText";
import styles from "../../styles/BookServices/BookServices.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faStar,
  faLocationDot,
  faCalendarDays,
  faClock,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { faAngellist } from "@fortawesome/free-brands-svg-icons";

const BookServices = () => {
  const formRef = useRef(null);

  // Sirf selected date ke liye state
  const [selectedDate, setSelectedDate] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const currentTime = new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(formRef.current));

    console.log("Search Data:", data);

    // TODO:
    // SearchServices(data);
  };

  return (
    <>
      <Navbar />

      <div className="Container">
        <div className={styles.hero}>
          <div className={styles.Content}>
            <div className={styles.herotext}>
              <span className={styles.badge}>
                <FontAwesomeIcon icon={faCircleCheck} /> 25,000+ Verified
                Professionals
              </span>

              <p className={styles.Pera1}>
                Find trusted services{" "}
                <span className={styles.blue}>near you.</span>
              </p>

              <p className={styles.Pera2}>
                Book reliable professionals for every corner of your home, in
                just a few taps.
              </p>

              <p className={styles.Pera3}>
                <span className={styles.badge1}>
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    style={{ color: "green" }}
                  />{" "}
                  Background Checked
                </span>

                <span className={styles.badge2}>
                  <FontAwesomeIcon icon={faStar} style={{ color: "#facc15" }} />{" "}
                  4.8 Average Ratings
                </span>
              </p>
            </div>

            <div className={styles.heroimage}>
              <img
                src="/partner.jpeg"
                alt="Partner"
                className={styles.heroImg}
              />
            </div>
          </div>

          <LineText />

          <div className={styles.SearchServicesCon}>
            <form
              ref={formRef}
              className={styles.SearchForm}
              onSubmit={handleSubmit}
            >
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
                  </select>
                </div>
              </label>

              {/* Location */}
              <label className={styles.Label} htmlFor="location">
                <FontAwesomeIcon
                  className={styles.Location}
                  icon={faLocationDot}
                />

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
                <FontAwesomeIcon
                  className={styles.Icons}
                  icon={faCalendarDays}
                />

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

              <button type="submit" className={styles.Button}>
                <FontAwesomeIcon icon={faMagnifyingGlass} /> Search Services
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default BookServices;
