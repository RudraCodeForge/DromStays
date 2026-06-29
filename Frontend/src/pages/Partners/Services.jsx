import styles from "../../styles/Services.module.css";
import Navber from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ServiceForm from "../../components/ServiceForm";
import PartnerSideBar from "../../components/Partner/PartnerSidebar";
import { services as trial, PartnerData } from "../../data/TrialServices";
import ServiceContainer from "../../components/Partner/ServiceContainer";
const Services = () => {
  const { isAuthenticated, role } = useSelector((state) => state.auth || {});
  const navigate = useNavigate();
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
          <PartnerSideBar Link={Link} setLink={setLink} />
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
