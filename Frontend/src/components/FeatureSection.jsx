import Style from "../styles/Home.module.css";
import FeatureCard from "./FeatureCard.jsx";
const FeatureSection = ({ features }) => {
  return (
    <div className={Style.Features_Con}>
      {features.map((item, index) => (
        <FeatureCard key={index} item={item} />
      ))}
    </div>
  );
};
export default FeatureSection;
