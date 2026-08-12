import styles from "../../styles/Services.module.css";

const ServiceCard = ({
  Status = "ALL",
  services = [],
  searchTerm = "",
  sortBy = "",
  mode = "partner",
  service = null,
  onEdit,
  onDelete,
  onBook,
}) => {
  const renderCard = (item) => {
    const key = item._id || item.id || item.serviceName;

    return (
      <div className={styles.serviceCard} key={key}>
        {item.coverImage && (
          <img
            src={item.coverImage}
            alt={item.serviceName}
            className={styles.serviceImage}
          />
        )}

        <div className={styles.serviceContent}>
          <div className={styles.serviceHeader}>
            <h3>{item.serviceName || item.name || "Service"}</h3>

            {mode !== "results" && item.status && (
              <span
                className={`${styles.badge} ${
                  item.status === "Active"
                    ? styles.BadgeActive
                    : item.status === "Pending"
                      ? styles.pending
                      : styles.inactive
                }`}
              >
                {item.status}
              </span>
            )}
          </div>

          {item.category && <p className={styles.category}>{item.category}</p>}
          {item.description && (
            <p className={styles.description}>{item.description}</p>
          )}

          <div className={styles.serviceInfo}>
            {item.price !== undefined && <span>💰 ₹{item.price}</span>}
            {item.estimatedDuration && (
              <span>
                ⏱ {item.estimatedDuration} {item.durationUnit || item.unit}
              </span>
            )}
            {item.rating !== undefined && <span>⭐ {item.rating}</span>}
          </div>

          <div className={styles.footer}>
            {item.reviews !== undefined && <span>{item.reviews} Reviews</span>}

            <div className={styles.actions}>
              {mode === "partner" ? (
                <>
                  <button
                    type="button"
                    className={styles.editBtn}
                    onClick={() => onEdit?.(item)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={() => onDelete?.(item)}
                  >
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className={styles.editBtn}
                    onClick={() => onBook?.(item)}
                  >
                    Book Now
                  </button>
                  <button
                    type="button"
                    className={styles.editBtn}
                    onClick={() => onBook?.(item)}
                  >
                    Cart
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (service) {
    return <div className={styles.Services}>{renderCard(service)}</div>;
  }

  const filtered = [...services]
    .filter((item) =>
      Status === "ALL" ? true : item.status.toUpperCase() === Status,
    )
    .filter((item) =>
      (item.serviceName || "").toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "A-Z":
          return (a.serviceName || "").localeCompare(b.serviceName || "");
        case "Z-A":
          return (b.serviceName || "").localeCompare(a.serviceName || "");
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
      {filtered.length > 0 ? (
        filtered.map((item) => renderCard(item))
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
