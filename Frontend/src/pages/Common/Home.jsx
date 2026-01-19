import Navbar from "../../components/Navbar/Navbar.jsx";
import Style from "../../styles/Home.module.css";
import Footer from "../../components/Footer.jsx";
import ReviewsSection from "../../components/ReviewSection.jsx";
import HeroSection from "../../components/HeroSection.jsx";
import { useEffect, useState } from "react";
import { getReviews } from "../../services/reviews.service.js";
import HowItWorks from "../../components/HowItWorks.jsx";
import { steps } from "../../data/steps.js";
import { features } from "../../data/features.js";
import FeatureSection from "../../components/FeatureSection.jsx";
import FilterContainer from "../../components/FilterContainer.jsx";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getReviews()
      .then((data) => {
        setReviews(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <div className={Style.Home_Con}>
        <HeroSection />
        <FilterContainer
          onFilter={(filters) => {
            const queryParams = new URLSearchParams();
            if (filters.location) {
              queryParams.append("location", filters.location);
            }
            if (filters.roomType) {
              queryParams.append("roomType", filters.roomType);
            }
            if (filters.billingType) {
              queryParams.append("billingType", filters.billingType);
            }
            if (filters.nearBy) {
              queryParams.append("nearby", "true");
              if (filters.coords) {
                queryParams.append("lat", filters.coords.lat);
                queryParams.append("lng", filters.coords.lng);
              }
            }
            navigate(`/explore_properties?${queryParams.toString()}`);
          }}
        />
      </div>
      <div className={Style.WhyUs_Con}>
        <h2>Why Choose Us?</h2>
        <p>
          We provide the best tools to make your rental experience smooth and
          secure.
        </p>
      </div>
      <FeatureSection features={features} />
      <HowItWorks steps={steps} />
      <div className={Style.WhyUs_Con}>
        <h2>What Our Users Say</h2>
        <p>Real stories from our happy community of renters and landlords.</p>
      </div>
      <ReviewsSection reviews={reviews} />
      <Footer />
    </div>
  );
};
export default Home;
