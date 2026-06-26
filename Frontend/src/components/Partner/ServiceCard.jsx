import styles from "../../styles/Services.module.css";
const ServiceCard = ({ Status, trial }) => {
  return (
    <div className={styles.Services}>
      {trial
        .filter((item) =>
          Status === "ALL" ? true : item.status.toUpperCase() === Status,
        )
        .map((service, index) => (
          <div className={styles.serviceCard} key={index}>
            <img
              src={service.image}
              alt={service.serviceName}
              className={styles.serviceImage}
            />

            <div className={styles.serviceContent}>
              <div className={styles.serviceHeader}>
                <h3>{service.serviceName}</h3>

                <span
                  className={`${styles.badge} ${
                    service.status === "Active"
                      ? styles.BadgeActive
                      : service.status === "Pending"
                        ? styles.pending
                        : styles.inactive
                  }`}
                >
                  {service.status}
                </span>
              </div>

              <p className={styles.category}>{service.category}</p>

              <p className={styles.description}>{service.description}</p>

              <div className={styles.serviceInfo}>
                <span>💰 ₹{service.price}</span>
                <span>⏱ {service.duration}</span>
                <span>⭐ {service.rating}</span>
              </div>

              <div className={styles.footer}>
                <span>{service.reviews} Reviews</span>

                <div className={styles.actions}>
                  <button className={styles.editBtn}>Edit</button>
                  <button className={styles.deleteBtn}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};
export default ServiceCard;
