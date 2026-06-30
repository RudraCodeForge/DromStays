import styles from "../../styles/Services.module.css";

const ServiceCard = ({ Status, services, searchTerm, sortBy }) => {
  const filteredServices = [...services]
    .filter((item) =>
      Status === "ALL" ? true : item.status.toUpperCase() === Status,
    )
    .filter((item) =>
      item.serviceName.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "A-Z":
          return a.serviceName.localeCompare(b.serviceName);

        case "Z-A":
          return b.serviceName.localeCompare(a.serviceName);

        case "Newest":
          return new Date(b.createdAt) - new Date(a.createdAt);

        case "Oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);

        default:
          return 0;
      }
    });

  return (
    <div className={styles.Services}>
      {filteredServices.length > 0 ? (
        filteredServices.map((service) => (
          <div className={styles.serviceCard} key={service._id}>
            <img
              src={service.coverImage}
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
        ))
      ) : (
        <div className={styles.noData}>
          <h3>No Services Found</h3>
          <p>Try changing the search or filter.</p>
        </div>
      )}
    </div>
  );
};

export default ServiceCard;
