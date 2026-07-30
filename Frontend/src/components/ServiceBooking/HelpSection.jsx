import { useState } from "react";
import styles from "../../styles/BookServices/BookServices.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import Popup from "../Popup";

const NeedHelp = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    console.log(formData);

    setFormData({
      name: "",
      mobile: "",
    });

    setOpenPopup(false);
  };
  return (
    <>
      <div className={styles.HelpCon}>
        <span className={styles.CommentIcon}>
          <FontAwesomeIcon icon={faComment} />
        </span>

        <h3>Need help choosing a service?</h3>

        <p>
          Our friendly support team is available around the clock to help you
          find the perfect fit.
        </p>

        <div className={styles.HelpButtonCon}>
          <button className={styles.Chat}>Chat With Us</button>

          <button className={styles.Call} onClick={() => setOpenPopup(true)}>
            Call Support
          </button>
        </div>
      </div>

      <Popup
        isOpen={openPopup}
        title="Request a Call Back"
        message="Enter your details and our team will call you shortly."
        type="info"
        primaryText="Submit"
        secondaryText="Cancel"
        onPrimaryClick={handleSubmit}
        onSecondaryClick={() => setOpenPopup(false)}
        onClose={() => setOpenPopup(false)}
      >
        <input
          className={styles.PopupInput}
          type="text"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          className={styles.PopupInput}
          type="tel"
          name="mobile"
          placeholder="Enter your mobile number"
          maxLength={10}
          value={formData.mobile}
          onChange={handleChange}
        />
      </Popup>
    </>
  );
};

export default NeedHelp;
