import styles from "../../styles/BookServices/BookServices.module.css";
import PopularServiceCard from "../PopularServiceCard";
import { popularServices, professionals } from "../../data/Services";
import { NavLink } from "react-router-dom";
import ProfessionalCard from "./ProfessionalCard";
const PopularServices = ({
  PSTagline,
  PSHeading,
  PSSubHeading,
  PSLinkText,
  PSLink,
  PSCardType,
}) => {
  const linkText = PSLinkText || "See all services";
  const linkTo = PSLink || "/services";

  return (
    <div className={styles.PopularServicesContainer}>
      <span className={styles.tagline}>{PSTagline}</span>

      <span className={styles.Heading}>{PSHeading}</span>

      <div className={styles.headerRow}>
        <span className={styles.SubHeading}>{PSSubHeading}</span>

        <NavLink to={linkTo} className={styles.viewAllLink}>
          {linkText} <span aria-hidden="true">&gt;</span>
        </NavLink>
      </div>
      {PSCardType ? (
        <div className={styles.cardContainer}>
          {professionals.map((professional) => (
            <ProfessionalCard
              key={professional.id}
              professional={professional}
            />
          ))}
        </div>
      ) : (
        <div className={styles.cardContainer}>
          {popularServices.map((service) => (
            <PopularServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PopularServices;
