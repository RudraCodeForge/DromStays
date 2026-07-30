import Styles from "../styles/Popup.module.css";

const Popup = ({
  isOpen,
  title = "Notification",
  message = "",
  type = "info", // success | error | warning | info
  primaryText = "OK",
  secondaryText,
  secondaryClassName = "",
  onPrimaryClick,
  onSecondaryClick,
  onClose,
  children, // Optional content (Form, OTP, etc.)
}) => {
  if (!isOpen) return null;

  const icons = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  };

  return (
    <div className={Styles.overlay}>
      <div className={Styles.popup}>
        <button className={Styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        <div className={`${Styles.icon} ${Styles[type]}`}>{icons[type]}</div>

        <h2>{title}</h2>

        {message && <p>{message}</p>}

        {/* Optional Form / Custom Content */}
        {children && <div className={Styles.content}>{children}</div>}

        <div className={Styles.actions}>
          {secondaryText && (
            <button
              className={`${Styles.secondaryBtn} ${
                secondaryClassName ? Styles[secondaryClassName] : ""
              }`}
              onClick={onSecondaryClick}
            >
              {secondaryText}
            </button>
          )}

          <button
            className={`${Styles.primaryBtn} ${Styles[type]}`}
            onClick={onPrimaryClick}
          >
            {primaryText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
