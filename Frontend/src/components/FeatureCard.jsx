import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Style from "../styles/FeatureCard.module.css";

const FeatureCard = ({ item }) => {
  return (
    <div className={Style.FeatureCard}>
      <div className={Style.icon}>
        <FontAwesomeIcon icon={item.Icon} />
      </div>
      <div className={Style.content}>
        <h3>{item.Title}</h3>
        <p>{item.Desc}</p>
      </div>
    </div>
  );
};
export default FeatureCard;
