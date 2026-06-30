import styles from "../../styles/Services.module.css";
import Navber from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ServiceForm from "../../components/ServiceForm";
import PartnerSideBar from "../../components/Partner/PartnerSidebar";
import {
  CheckPartnerProfile,
  GetServicesByPartnerId,
} from "../../services/Partner.service";
import ServiceContainer from "../../components/Partner/ServiceContainer";

const Services = () => {
  const { isAuthenticated, role } = useSelector((state) => state.auth || {});

  const navigate = useNavigate();
  const location = useLocation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [Status, setStatus] = useState("ALL");
  const [Link, setLink] = useState("services");

  const [partnerData, setPartnerData] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Authentication Check
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (role !== "partner") {
      navigate("/unauthorized");
    }
  }, [isAuthenticated, role, navigate]);

  // Fetch Partner & Services
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const partner = await CheckPartnerProfile();
        setPartnerData(partner);

        if (partner?.partnerId) {
          const serviceData = await GetServicesByPartnerId(partner.partnerId);

          setServices(serviceData.services || serviceData || []);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle Tab Change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setLink(params.get("tab") || "services");
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
              <img src={partnerData?.Logo} alt={partnerData?.BussinessName} />
            </div>

            <div className={styles.partnerInfo}>
              <h3>{partnerData?.BussinessName}</h3>
              <p>{partnerData?.Subscription}</p>
            </div>
          </div>

          <PartnerSideBar Link={Link} handleClick={handleClick} />
        </div>

        <div className={styles.RightCon}>
          {Link === "services" && (
            <ServiceContainer
              Status={Status}
              setStatus={setStatus}
              services={services}
              setServices={setServices}
              setIsDrawerOpen={setIsDrawerOpen}
              loading={loading} // 👈 Pass loading here
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
