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
import { Get_Owner_Rooms } from "../../services/Rooms.service.js";
import { Get_All_Activities } from "../../services/RecentActivity.service.js";
import {
  Get_Advance_paymentsByOwnerId,
  Expected_Advance_PaymentsByOwnerId,
} from "../../services/Payment.service.js";

const ONE_DAY = 24 * 60 * 60 * 1000;

const OwnerDashboard = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [Rooms, setRooms] = useState(0);
  const [newRooms, setNewRooms] = useState(0);
  const [activities, setActivities] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [advancePayments, setAdvancePayments] = useState([]);

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

  // Recent Activities
  useEffect(() => {
    let isMounted = true;

    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await Get_All_Activities();

        if (isMounted) {
          setActivities(data.activities || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || "Failed to load activities");
          console.error("Error fetching activities:", err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchActivities();

    return () => {
      isMounted = false;
    };
  }, []);

  // Advance Payments

  useEffect(() => {
    const fetchAdvancePayments = async () => {
      try {
        if (user && user.id) {
          const res = await Get_Advance_paymentsByOwnerId(user.id);

          // ✅ yaha state set kar
          setAdvancePayments(res.data || []);
        }
      } catch (error) {
        console.error("Error fetching advance payments:", error);
      }
    };

    fetchAdvancePayments();
  }, [user]);

  const totalAdvanceBalance = advancePayments.reduce(
    (sum, payment) => sum + (payment.amount || 0),
    0
  );

  // Expected Collections
  const [expectedCollections, setExpectedCollections] = useState([]);
  useEffect(() => {
    const fetchExpectedCollections = async () => {
      try {
        if (user && user.id) {
          const res = await Expected_Advance_PaymentsByOwnerId(user.id);
          setExpectedCollections(res.data || []);
        }
      } catch (error) {
        console.error("Error fetching expected collections:", error);
      }
    };

    fetchExpectedCollections();
  }, [user]);
  const totalExpectedCollection = expectedCollections.reduce(
    (sum, payment) => sum + (payment.amount || 0),
    0
  );

  console.log("Expected Collections:", expectedCollections);
  console.log("Total Expected Collection:", totalExpectedCollection);

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

        // 🆕 / 🔴 Handle room count change
        if (currentCount !== prevCount) {
          const diff = currentCount - prevCount;

          // 🟢 Rooms added
          if (diff > 0) {
            const updatedCount = storedBadge ? storedBadge.count + diff : diff;

            localStorage.setItem(
              "owner_rooms_badge",
              JSON.stringify({
                count: updatedCount,
                timestamp: storedBadge ? storedBadge.timestamp : now,
              })
            );

            setNewRooms(updatedCount);
          }

          // 🔴 Rooms deleted
          else {
            if (storedBadge) {
              const reducedCount = Math.max(
                storedBadge.count + diff, // diff is negative
                0
              );

              if (reducedCount > 0) {
                localStorage.setItem(
                  "owner_rooms_badge",
                  JSON.stringify({
                    count: reducedCount,
                    timestamp: storedBadge.timestamp,
                  })
                );
                setNewRooms(reducedCount);
              } else {
                localStorage.removeItem("owner_rooms_badge");
                setNewRooms(0);
              }
            } else {
              setNewRooms(0);
            }
          }
        }

        // Same count – keep badge if exists
        else if (storedBadge) {
          setNewRooms(storedBadge.count);
        } else {
          setNewRooms(0);
        }

        // 🔄 Update current count
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

  // Activites list rendring logic can be added here

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

          <StatCard
            icon={faWallet}
            title="Advance Balance"
            value={`₹${totalAdvanceBalance}`}
          />

          <StatCard
            icon={faMoneyBills}
            title="Expected Collection"
            value={`₹${totalExpectedCollection}`}
            badge="This month"
            badgeType="success"
          />
        </div>

        {/* 📌 Activity + Actions */}
        <div className={Styles.placeholderSection}>
          <div className={Styles.RightBox}>
            <h2>Recent Activity</h2>

            <ul className={Styles.ActivityList}>
              {/* Loading */}
              {loading && (
                <li className={Styles.EmptyActivity}>Loading activities…</li>
              )}

              {/* Error */}
              {!loading && error && (
                <li className={Styles.EmptyActivity}>{error}</li>
              )}

              {/* Empty */}
              {!loading && !error && activities.length === 0 && (
                <li className={Styles.EmptyActivity}>No recent activity</li>
              )}

              {/* List */}
              {!loading &&
                !error &&
                activities.slice(0, 10).map((activity) => (
                  <li
                    key={activity._id}
                    className={Styles.ActivityItem}
                    aria-label="Recent activity item"
                  >
                    <span className={Styles.ActivityIcon}>
                      {getActivityIcon(activity)}
                    </span>

                    <div className={Styles.ActivityContent}>
                      <p className={Styles.ActivityMessage}>
                        {activity.message}
                      </p>
                      <span className={Styles.ActivityTime}>
                        {timeAgo(activity.createdAt)}
                      </span>
                    </div>
                  </li>
                ))}
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
                <NavLink
                  to="/Owner/ManageRequests"
                  className={Styles.ActionLink}
                >
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
