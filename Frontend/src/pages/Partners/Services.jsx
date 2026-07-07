import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import styles from "../../styles/Services.module.css";

import Navber from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import ServiceForm from "../../components/ServiceForm";
import PartnerSideBar from "../../components/Partner/PartnerSidebar";
import ServiceContainer from "../../components/Partner/ServiceContainer";
import NoPartnerProfile from "../../components/Partner/NoPartnerProfile";
import {
  CheckPartnerProfile,
  GetServicesByPartnerId,
} from "../../services/Partner.service";

const Services = () => {
  const { isAuthenticated, role } = useSelector((state) => state.auth || {});
  const { partner } = useSelector((state) => state.partner || {});

  const navigate = useNavigate();
  const location = useLocation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [status, setStatus] = useState("ALL");
  const [link, setLink] = useState("services");

  const [partnerData, setPartnerData] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Authentication & Authorization
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    if (role !== "partner") {
      navigate("/unauthorized", { replace: true });
    }
  }, [isAuthenticated, role, navigate]);

  // Fetch Partner Profile & Services
  useEffect(() => {
    if (!isAuthenticated || role !== "partner") return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const partnerResponse = await CheckPartnerProfile();

        if (!partnerResponse?.partnerId) {
          setPartnerData(null);
          setServices([]);
          return;
        }

        setPartnerData(partnerResponse);

        const serviceResponse = await GetServicesByPartnerId(
          partnerResponse.partnerId,
        );

        setServices(serviceResponse?.services || []);
      } catch (error) {
        console.error("Error fetching partner/services:", error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, role]);

  // Handle Sidebar Tabs
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

      {!loading && !partnerData ? (
        <NoPartnerProfile />
      ) : (
        <>
          <div className={styles.container}>
            <div className={styles.leftCon}>
              <div className={styles.PartnerProfile}>
                <div className={styles.partnerLogo}>
                  <img
                    src={partnerData?.Logo || "/images/default-partner.png"}
                    alt={partnerData?.BussinessName || "Partner"}
                  />
                </div>

                <div className={styles.partnerInfo}>
                  <h3>{partnerData?.BussinessName || "Partner"}</h3>
                  <p>{partnerData?.Subscription || "Free Plan"}</p>
                </div>
              </div>

              <PartnerSideBar Link={link} handleClick={handleClick} />
            </div>

            <div className={styles.RightCon}>
              {link === "services" && (
                <ServiceContainer
                  Status={status}
                  setStatus={setStatus}
                  services={services}
                  setServices={setServices}
                  setIsDrawerOpen={setIsDrawerOpen}
                  loading={loading}
                />
              )}

              {link === "earnings" && <h1>Earnings Page</h1>}

              {link === "requests" && <h1>Requests Page</h1>}
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
        </>
      )}

      <Footer />
    </>
  );
};

export default Services;
