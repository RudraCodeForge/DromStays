import Styles from "../../styles/OwnerDashboard.module.css";

const getActivityIcon = (activity) => {
  const { entityType, action } = activity;

  if (entityType === "PROPERTY" && action === "CREATED") return "🏠";
  if (entityType === "PROPERTY" && action === "DELETED") return "🗑️";

  if (entityType === "BOOKING" && action === "BOOKED") return "🛏️";
  if (entityType === "BOOKING" && action === "CANCELLED") return "❌";

  if (entityType === "PAYMENT" && action === "PAID") return "💰";
  if (entityType === "PAYMENT" && action === "FAILED") return "⚠️";

  if (entityType === "SERVICE" && action === "COMPLETED") return "🧹";

  return "🔔";
};

const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;

  return `${Math.floor(diff / 86400)} days ago`;
};

const RecentActivity = ({ activities = [], loading }) => {
  return (
    <div className={Styles.RightBox}>
      <h2>Recent Activity</h2>

      <ul className={Styles.ActivityList}>
        {loading && (
          <li className={Styles.EmptyActivity}>Loading activities…</li>
        )}

        {!loading && activities.length === 0 && (
          <li className={Styles.EmptyActivity}>No recent activity</li>
        )}

        {!loading &&
          activities.slice(0, 10).map((activity) => (
            <li key={activity._id} className={Styles.ActivityItem}>
              <span className={Styles.ActivityIcon}>
                {getActivityIcon(activity)}
              </span>

              <div className={Styles.ActivityContent}>
                <p className={Styles.ActivityMessage}>{activity.message}</p>
                <span className={Styles.ActivityTime}>
                  {timeAgo(activity.createdAt)}
                </span>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default RecentActivity;
