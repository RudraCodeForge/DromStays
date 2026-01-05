import Styles from "../styles/StatCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const StatCard = ({
  icon,
  title,
  value,
  badge,
  badgeType,
  backgroundColor,
  color,
  onClick, // 👈 NEW (optional)
}) => {
  return (
    <div
      className={Styles.Card}
      onClick={onClick}
      style={{
        cursor: onClick ? "pointer" : "default",
      }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          onClick();
        }
      }}
    >
      <div className={Styles.TopRow}>
        <div
          className={Styles.IconBox}
          style={{
            backgroundColor: backgroundColor,
            color: color,
          }}
        >
          <FontAwesomeIcon icon={icon} />
        </div>

        {badge && (
          <span className={`${Styles.Badge} ${Styles[badgeType]}`}>
            {badge}
          </span>
        )}
      </div>

      <p className={Styles.Title}>{title}</p>
      <h2 className={Styles.Value}>{value}</h2>
    </div>
  );
};

export default StatCard;
