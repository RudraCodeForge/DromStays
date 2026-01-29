import Styles from "../../styles/OwnerDashboard.module.css";
import { useNavigate } from "react-router-dom";
import {
  faHouseChimney,
  faMoneyBills,
  faTriangleExclamation,
  faWallet,
  faClock,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";
import StatCard from "../../components/StatCard";

const DashboardStats = ({ rooms, newRooms, advance, expected, overdue, pendingRequests, activeBookings }) => {
  const navigate = useNavigate(); // ✅ FIX

  return (
    <div className={Styles.cardsContainer}>
      <StatCard
        icon={faHouseChimney}
        title="Total Rooms"
        value={rooms}
        badge={newRooms > 0 ? `+${newRooms} new` : null}
        badgeType="success"
      />

      <StatCard icon={faCalendarCheck} title="Active Bookings" value={activeBookings} />

      <StatCard
        icon={faClock}
        title="Pending Requests"
        value={pendingRequests}
        badge="Needs action"
        badgeType="warning"
        onClick={() => navigate("/Owner/ManageRequests?status=pending")}
      />


      <StatCard
        icon={faTriangleExclamation}
        title="Overdue Payments"
        value={`₹${overdue}`}
        badge="Immediate action"
        badgeType="danger"
      />

      <StatCard icon={faWallet} title="Advance Balance" value={`₹${advance}`} />

      <StatCard
        icon={faMoneyBills}
        title="Expected Collection"
        value={`₹${expected}`}
        badge="This month"
        badgeType="success"
      />
    </div>
  );
};

export default DashboardStats;
