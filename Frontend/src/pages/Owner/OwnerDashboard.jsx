import Styles from "../../styles/OwnerDashboard.module.css";
import Navbar from "../../components/Navbar/Navbar.jsx";
import { NavLink, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer.jsx";
import { useEffect, useState } from "react";
import {
  faHouseChimney,
  faCalendarCheck,
  faClock,
  faWallet,
  faCalendar,
  faCirclePlus,
  faListCheck,
  faMoneyBills,
  faHeadset,
  faArrowRight,
  faComments,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StatCard from "../../components/StatCard.jsx";
import { useSelector } from "react-redux";
import { Get_Owner_Rooms } from "../../services/Rooms";

const ONE_DAY = 24 * 60 * 60 * 1000;

const OwnerDashboard = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [Rooms, setRooms] = useState(0);
  const [newRooms, setNewRooms] = useState(0);

  // 🔐 Auth + Role Guard (Role with capital R)
  useEffect(() => {
    if (!isAuthenticated || user?.Role?.toLowerCase() !== "owner") {
      navigate("/Login");
    }
  }, [isAuthenticated, user, navigate]);

  // 🎨 Background
  useEffect(() => {
    document.body.style.backgroundColor = "#1f126a1f";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  // 🏠 Rooms + 24hr Badge Logic (Frontend Only)
  useEffect(() => {
    const fetchRoomCount = async () => {
      try {
        const data = await Get_Owner_Rooms();
        const currentCount = data?.rooms?.length || 0;

        const prevCount =
          Number(localStorage.getItem("owner_rooms_count")) || 0;

        const storedBadge = JSON.parse(
          localStorage.getItem("owner_rooms_badge")
        );

        const now = Date.now();

        // 🧹 Auto cleanup after 24 hrs
        if (storedBadge && now - storedBadge.timestamp > ONE_DAY) {
          localStorage.removeItem("owner_rooms_badge");
        }

        // 🆕 New rooms added
        if (currentCount > prevCount) {
          const diff = currentCount - prevCount;

          const updatedCount = storedBadge ? storedBadge.count + diff : diff;

          localStorage.setItem(
            "owner_rooms_badge",
            JSON.stringify({
              count: updatedCount,
              timestamp: storedBadge ? storedBadge.timestamp : now,
            })
          );

          setNewRooms(updatedCount);
        } else if (storedBadge) {
          setNewRooms(storedBadge.count);
        } else {
          setNewRooms(0);
        }

        setRooms(currentCount);
        localStorage.setItem("owner_rooms_count", currentCount);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRoomCount();
  }, []);

  const todayDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <>
      <Navbar />

      <div className={Styles.dashboardContainer}>
        <h1 className={Styles.dashboardTitle}>
          Welcome back, {user?.Name || "Owner"}
        </h1>

        <div className={Styles.dashboardHeader}>
          <p className={Styles.dashboardDescription}>
            Here's what's happening with your properties today.
          </p>
          <span className={Styles.Date}>
            <FontAwesomeIcon icon={faCalendar} /> &nbsp;{todayDate}
          </span>
        </div>

        {/* 📊 Stats */}
        <div className={Styles.cardsContainer}>
          <StatCard
            icon={faHouseChimney}
            title="Total Rooms"
            value={Rooms}
            badge={newRooms > 0 ? `+${newRooms} new` : null}
            badgeType="success"
          />

          <StatCard icon={faCalendarCheck} title="Active Bookings" value="8" />

          {/* 🔔 CLICKABLE CARD */}
          <StatCard
            icon={faClock}
            title="Pending Requests"
            value="3"
            badge="Needs action"
            badgeType="warning"
            onClick={() => navigate("/Owner/Requests")}
          />

          <StatCard
            icon={faMoneyBills}
            title="Rent Due Today"
            value="3"
            badge="Action needed"
            badgeType="danger"
          />

          <StatCard
            icon={faTriangleExclamation}
            title="Overdue Payments"
            value="₹5,500"
          />

          <StatCard icon={faWallet} title="Advance Balance" value="₹8,000" />

          <StatCard
            icon={faMoneyBills}
            title="Expected Collection"
            value="₹42,000"
            badge="This month"
            badgeType="success"
          />
        </div>

        {/* 📌 Activity + Actions */}
        <div className={Styles.placeholderSection}>
          <div className={Styles.RightBox}>
            <h2>Recent Activity</h2>
            <ul className={Styles.ActivityList}>
              <li>🛏️ Room booked by Rahul</li>
              <li>💰 Payment received ₹3,000</li>
              {newRooms > 0 && <li>➕ {newRooms} new room added</li>}
              <li>⏰ Rent due reminder sent</li>
            </ul>
          </div>

          <div className={Styles.LeftBox}>
            <h2>Quick Actions</h2>
            <p>Manage your properties efficiently</p>

            <ul className={Styles.ActionList}>
              <li>
                <NavLink to="/Owner/add-property" className={Styles.ActionLink}>
                  <span className={Styles.Left}>
                    <FontAwesomeIcon icon={faCirclePlus} /> Add New Property
                  </span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/Owner/ManageServices"
                  className={Styles.ActionLink}
                >
                  <span className={Styles.Left}>
                    <FontAwesomeIcon icon={faListCheck} /> Manage Services
                  </span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </NavLink>
              </li>

              <li>
                <NavLink to="/Owner/ViewPayments" className={Styles.ActionLink}>
                  <span className={Styles.Left}>
                    <FontAwesomeIcon icon={faMoneyBills} /> View Payments
                  </span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </NavLink>
              </li>

              <li>
                <NavLink to="/Owner/Requests" className={Styles.ActionLink}>
                  <span className={Styles.Left}>
                    <FontAwesomeIcon icon={faClock} /> Manage Requests
                  </span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </NavLink>
              </li>

              <li>
                <NavLink to="/FeedBack" className={Styles.ActionLink}>
                  <span className={Styles.Left}>
                    <FontAwesomeIcon icon={faComments} /> Feedback
                  </span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </NavLink>
              </li>

              <li>
                <NavLink to="/Owner/Support" className={Styles.ActionLink}>
                  <span className={Styles.Left}>
                    <FontAwesomeIcon icon={faHeadset} /> Support
                  </span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default OwnerDashboard;
