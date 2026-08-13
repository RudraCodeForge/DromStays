import styles from "../../styles/Cart.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "../../redux/cartSlice";
import { useNavigate } from "react-router-dom";
const AddedServices = ({ cartItems }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div className={styles.AddedServices}>
      <h2 className={styles.addedServicesTitle}>Added Services</h2>
      <div className={styles.subTitle}>
        <p className={styles.subTitleText}>
          Make your stay even more comfortable
        </p>
        <div className={styles.badge}>
          <span>{cartItems.length}</span>
          <span> Added</span>
        </div>
      </div>
      <div className={styles.ServicescardContainer}>
        {cartItems.map((item) => (
          <div className={styles.Servicescard} key={item.serviceId}>
            {/* Service Image */}
            <div className={styles.serviceLogo}>
              <img src={item.coverImage} alt={item.serviceName} />
            </div>

            {/* Service Details */}
            <div className={styles.serviceDetails}>
              <h3>{item.serviceName}</h3>

              <p>
                {item.duration} {item.durationUnit} service
              </p>

              <strong>₹{item.price * item.quantity}</strong>
            </div>

            {/* Quantity */}
            <div className={styles.quantityControl}>
              <button
                onClick={() => dispatch(decreaseQuantity(item.serviceId))}
              >
                −
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => dispatch(increaseQuantity(item.serviceId))}
              >
                +
              </button>
            </div>

            {/* Delete */}
            <button
              className={styles.deleteButton}
              onClick={() => dispatch(removeFromCart(item.serviceId))}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        ))}
      </div>
      <button
        className={styles.addMoreButton}
        onClick={() => navigate("/Book/Services")}
      >
        <FontAwesomeIcon icon={faPlus} /> Add More Services
      </button>
    </div>
  );
};
export default AddedServices;
