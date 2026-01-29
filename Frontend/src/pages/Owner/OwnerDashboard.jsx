import Styles from "../../styles/OwnerDashboard.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import DashboardStats from "../../components/Dashboard/DashboardStats";
import RecentActivity from "../../components/Dashboard/RecentActivity";
import QuickActions from "../../components/Dashboard/QuickActions";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useOwnerRooms } from "../../Custom/useOwnerRooms";
import { useDashboardPayments } from "../../Custom/useDashboardPayments";
import { useRecentActivities } from "../../Custom/useRecentActivities";
import { useRequests } from "../../Custom/useRequests";
import { useActiveBookings } from "../../Custom/useActiveBookings";

const OwnerDashboard = () => {
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();

  const { rooms, newRooms } = useOwnerRooms();
  const { activities, loading } = useRecentActivities();
  const { advanceBalance, expectedCollection, overdueAmount } =
    useDashboardPayments(user.id);

  const { pendingRequestsCount } = useRequests();
  const { activeBookings } = useActiveBookings();

  return (
    <>
      <Navbar />

      <div className={Styles.dashboardContainer}>
        <h1>Welcome back, {user?.Name}</h1>

        <DashboardStats
          rooms={rooms}
          newRooms={newRooms}
          advance={advanceBalance}
          expected={expectedCollection}
          overdue={overdueAmount}
          pendingRequests={pendingRequestsCount}
          activeBookings={activeBookings}
        />

        <div className={Styles.placeholderSection}>
          <RecentActivity activities={activities} loading={loading} />
          <QuickActions />
        </div>
      </div>

      <Footer />
    </>
  );
};
export default OwnerDashboard;
