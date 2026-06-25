import styles from "../../styles/Services.module.css";
import Navber from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Services = () => {
  const { isAuthenticated, role } = useSelector((state) => state.auth || {});
  const navigate = useNavigate();
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
      <div cclassName={styles.container}>
        <h1>Welcome to services page</h1>
      </div>
      <Footer />
    </>
  );
};
export default Services;
