import styles from "../../styles/BookServices/BookServices.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faStar } from "@fortawesome/free-solid-svg-icons";
import { faAngellist } from "@fortawesome/free-brands-svg-icons";
import ServiceForm from "./ServiceForm";
import LineText from "../LineText";
const ServiceHero = () => {
  return (
    <div className={styles.hero}>
      <div className={styles.Content}>
        <div className={styles.herotext}>
          <span className={styles.badge}>
            <FontAwesomeIcon icon={faCircleCheck} /> 25,000+ Verified
            Professionals
          </span>

          <p className={styles.Pera1}>
            Find trusted services <span className={styles.blue}>near you.</span>
          </p>

          <p className={styles.Pera2}>
            Book reliable professionals for every corner of your home, in just a
            few taps.
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
              <FontAwesomeIcon icon={faStar} style={{ color: "#facc15" }} /> 4.8
              Average Ratings
            </span>
          </p>
        </div>

        <div className={styles.heroimage}>
          <img src="/partner.jpeg" alt="Partner" className={styles.heroImg} />
        </div>
      </div>

      <LineText />
      <ServiceForm />
    </div>
  );
};
export default ServiceHero;
