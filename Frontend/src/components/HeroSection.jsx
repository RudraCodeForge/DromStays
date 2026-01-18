import Style from "../styles/Home.module.css";
import { useNavigate } from "react-router-dom";
const HeroSection = () => {
  const navigate = useNavigate();
  const ExploreProperty = () => {
    navigate("/explore_properties");
  };
  return (
    <div className={Style.Header_Con}>
      <h1>Find Your Perfect Room Effortlessly.</h1>
      <p>Seamlessly mamage and discover your rental room with DromStays.</p>
      <button onClick={ExploreProperty}>Explore Properties</button>
    </div>
  );
};
export default HeroSection;
