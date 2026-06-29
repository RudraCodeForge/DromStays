import styles from "../../styles/Services.module.css";
import Navber from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ServiceForm from "../../components/ServiceForm";
import PartnerSideBar from "../../components/Partner/PartnerSidebar";
import { services as trial, PartnerData } from "../../data/TrialServices";
import ServiceContainer from "../../components/Partner/ServiceContainer";
const Services = () => {
  const { isAuthenticated, role } = useSelector((state) => state.auth || {});
  const navigate = useNavigate();
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formcall, setFormCall] = useState(false);
  const [Status, setStatus] = useState("ALL");
  const [Link, setLink] = useState("services");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (role !== "partner") {
      navigate("/unauthorized");
    }
  }, [isAuthenticated, role, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab") || "services";
    setLink(tab);
  }, [location.search]);

  const handleClick = (page) => {
    setLink(page);
    navigate(`/Partner/Services?tab=${page}`);
  };
  return (
    <>
      <Navber />
      <div className={styles.container}>
        <div className={styles.leftCon}>
          <div className={styles.PartnerProfile}>
            <div className={styles.partnerLogo}>
              <img src={PartnerData.Logo} alt={PartnerData.BussinessName} />
            </div>

            <div className={styles.partnerInfo}>
              <h3>{PartnerData.BussinessName}</h3>
              <p>{PartnerData.Subscription}</p>
            </div>
          </div>
          <PartnerSideBar Link={Link} handleClick={handleClick} />
        </div>
        <div className={styles.RightCon}>
          {Link === "services" && (
            <ServiceContainer
              Status={Status}
              setStatus={setStatus}
              trial={trial}
              setIsDrawerOpen={setIsDrawerOpen}
            />
          )}
          {Link === "earnings" && <h1>Earnings Page</h1>}

          {Link === "requests" && <h1>Requests Page</h1>}
        </div>
      </div>

      <div
        className={`${styles.overlay} ${isDrawerOpen ? styles.show : ""}`}
        onClick={() => setIsDrawerOpen(false)}
      />
      <ServiceForm
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
      />
      <Footer />
    </>
  );
};
export default Services;
