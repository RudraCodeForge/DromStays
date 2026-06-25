import Styles from "../../styles/OwnerDashboard.module.css";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faListCheck,
  faMoneyBills,
  faClock,
  faComments,
  faArrowRight,
  faCalendarAlt,
  faMoneyBillWave,
} from "@fortawesome/free-solid-svg-icons";

const actionConfig = {
  owner: [
    {
      title: "Add New Property",
      path: "/Owner/add-property",
      icon: faCirclePlus,
    },
    {
      title: "Manage Services",
      path: "/Owner/ManageServices",
      icon: faListCheck,
    },
    {
      title: "View Payments",
      path: "/Owner/ViewPayments",
      icon: faMoneyBills,
    },
    {
      title: "Manage Requests",
      path: "/Owner/ManageRequests",
      icon: faClock,
    },
    {
      title: "Feedback",
      path: "/FeedBack",
      icon: faComments,
    },
  ],

  partner: [
    {
      title: "My Services",
      path: "/Partner/Services",
      icon: faListCheck,
    },
    {
      title: "Schedule",
      path: "/Schedule",
      icon: faCalendarAlt,
    },
    {
      title: "Earnings",
      path: "/Earnings",
      icon: faMoneyBillWave,
    },
    {
      title: "Reviews",
      path: "/Reviews",
      icon: faComments,
    },
  ],
};

const QuickActions = ({ role }) => {
  const actions = actionConfig[role] || [];

  return (
    <div className={Styles.LeftBox}>
      <h2>Quick Actions</h2>
      <p>
        {role === "owner"
          ? "Manage your properties efficiently"
          : "Manage your services efficiently"}
      </p>

      <ul className={Styles.ActionList}>
        {actions.map(({ title, path, icon }) => (
          <li key={path}>
            <NavLink to={path} className={Styles.ActionLink}>
              <span className={Styles.Left}>
                <FontAwesomeIcon icon={icon} /> {title}
              </span>

              <FontAwesomeIcon icon={faArrowRight} />
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuickActions;
