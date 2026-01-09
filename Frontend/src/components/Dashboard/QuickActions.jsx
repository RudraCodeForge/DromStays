import Styles from "../../styles/OwnerDashboard.module.css";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faListCheck,
  faMoneyBills,
  faClock,
  faComments,
  faHeadset,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

const QuickActions = () => {
  return (
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
          <NavLink to="/Owner/ManageServices" className={Styles.ActionLink}>
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
          <NavLink to="/Owner/ManageRequests" className={Styles.ActionLink}>
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

        {/*<li>
          <NavLink to="/Owner/Support" className={Styles.ActionLink}>
            <span className={Styles.Left}>
              <FontAwesomeIcon icon={faHeadset} /> Support
            </span>
            <FontAwesomeIcon icon={faArrowRight} />
          </NavLink>
        </li>*/}
      </ul>
    </div>
  );
};

export default QuickActions;
