import styles from "../../styles/Services.module.css";
import Navber from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ServiceForm from "../../components/ServiceForm";
import FilterBar from "../../components/Partner/FilterBar";
import { services as trial, PartnerData } from "../../data/TrialServices";
import ServiceCard from "../../components/Partner/ServiceCard";
const Services = () => {
  const { isAuthenticated, role } = useSelector((state) => state.auth || {});
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formcall, setFormCall] = useState(false);
  const [Status, setStatus] = useState("ALL");

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
        </div>
        <div className={styles.RightCon}>
          <div className={styles.Header}>
            <div className={styles.Contant}>
              <h2>Manage Services</h2>
              <p>Manage your all Services here...</p>
            </div>
            <button
              type="button"
              className={styles.Button}
              onClick={() => setIsDrawerOpen(true)}
            >
              Add Services
            </button>
          </div>
          <FilterBar status={Status} setStatus={setStatus} />
          <ServiceCard Status={Status} trial={trial} />
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
