import Styles from "../../styles/OwnerDashboard.module.css";
import Navbar from "../../components/Navbar/Navbar.jsx";
import { NavLink } from "react-router-dom";
import Footer from "../../components/Footer.jsx";
import { useEffect } from "react";
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
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StatCard from "../../components/StatCard.jsx";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const OwnerDashboard = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const statCardsData = [
    {
      icon: faHouseChimney,
      title: "Total Rooms",
      value: "12",
      badge: "+2 new",
      badgeType: "success",
    },
    {
      icon: faCalendarCheck,
      title: "Active Bookings",
      value: "8",
      backgroundColor: "#f5e6ffa7",
      color: "#bc05ffff",
    },
    {
      icon: faClock,
      title: "Pending Requests",
      value: "3",
      backgroundColor: "#fff4e5",
      color: "#ff9900",
      badge: "Action needed",
      badgeType: "warning",
    },
    {
      icon: faWallet,
      title: "Total Earnings",
      value: `₹${user?.WalletBalance || 0}`,
      backgroundColor: "#37ec0a6a",
      color: "#1a5c0aff",
      badge: "+12% this month",
      badgeType: "success",
    },
  ];
  const navigate = useNavigate();

  const todayDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  useEffect(() => {
    if (!isAuthenticated || user?.Role?.toLowerCase() !== "owner") {
      navigate("/Login");
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    document.body.style.backgroundColor = "#1f126a1f";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  return (
    <>
      <Navbar />

      <div className={Styles.dashboardContainer}>
        <h1 className={Styles.dashboardTitle}>
          Welcome back, {user?.Name || "Owner"}
        </h1>
        <div className={Styles.dashboardHeader}>
          <p className={Styles.dashboardDescription}>
            Here's what happening with your properties today.
          </p>
          <span className={Styles.Date}>
            <FontAwesomeIcon icon={faCalendar} />
            &nbsp;{todayDate}
          </span>
        </div>

        <div className={Styles.cardsContainer}>
          {statCardsData.map((card, index) => (
            <StatCard
              key={index}
              icon={card.icon}
              title={card.title}
              value={card.value}
              badge={card.badge}
              badgeType={card.badgeType}
              backgroundColor={card.backgroundColor}
              color={card.color}
            />
          ))}
        </div>
        <div className={Styles.placeholderSection}>
          <div className={Styles.RightBox}>
            <h2>Recent Activity</h2>

            <ul className={Styles.ActivityList}>
              <li>🛏️ Room booked by Rahul</li>
              <li>💰 Payment received ₹3,000</li>
              <li>➕ New room added</li>
              <li>🧹 Cleaning service requested</li>
            </ul>
          </div>
          <div className={Styles.LeftBox}>
            <h2>Quick Actions</h2>
            <p>Manage your properties effciently</p>
            <ul className={Styles.ActionList}>
              <li>
                <NavLink to="/Owner/add-property" className={Styles.ActionLink}>
                  <span className={Styles.Left}>
                    <FontAwesomeIcon icon={faCirclePlus} />
                    &nbsp;Add New Property
                  </span>
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className={Styles.Arrow}
                  />
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/Owner/ManageServices"
                  className={Styles.ActionLink}
                >
                  <span className={Styles.Left}>
                    <FontAwesomeIcon icon={faListCheck} />
                    &nbsp;Manage Services
                  </span>
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className={Styles.Arrow}
                  />
                </NavLink>
              </li>

              <li>
                <NavLink to="/Owner/ViewPayments" className={Styles.ActionLink}>
                  <span className={Styles.Left}>
                    <FontAwesomeIcon icon={faMoneyBills} />
                    &nbsp;View Payments
                  </span>
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className={Styles.Arrow}
                  />
                </NavLink>
              </li>

              <li>
                <NavLink to="/FeedBack" className={Styles.ActionLink}>
                  <span className={Styles.Left}>
                    <FontAwesomeIcon icon={faComments} />
                    &nbsp;FeedBack
                  </span>
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className={Styles.Arrow}
                  />
                </NavLink>
              </li>

              <li>
                <NavLink to="/Owner/Support" className={Styles.ActionLink}>
                  <span className={Styles.Left}>
                    <FontAwesomeIcon icon={faHeadset} />
                    &nbsp;Support
                  </span>
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className={Styles.Arrow}
                  />
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
