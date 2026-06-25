import Styles from "../../styles/OwnerDashboard.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import DashboardStats from "../../components/Dashboard/DashboardStats";
import RecentActivity from "../../components/Dashboard/RecentActivity";
import QuickActions from "../../components/Dashboard/QuickActions";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const PartnerDashboard = () => {
  const { isAuthenticated, role, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (role !== "partner") {
      navigate("/unauthorized");
    }
  }, [isAuthenticated, role, navigate]);

  return (
    <>
      <Navbar />

      <div className={Styles.dashboardContainer}>
        <h1>Welcome back, {user?.Name}</h1>

        <div className={Styles.placeholderSection}>
          <QuickActions role={role} />
        </div>
      </div>

      <Footer />
    </>
  );
};
export default PartnerDashboard;
