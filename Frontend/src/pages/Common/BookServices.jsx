import React, { useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import LineText from "../../components/LineText";
import styles from "../../styles/BookServices/BookServices.module.css";
import ServiceHero from "../../components/ServiceBooking/ServiceHero";
import QuickCatogary from "../../components/ServiceBooking/QuickCategory";
import PopularServices from "../../components/ServiceBooking/PopularServices";
import Promises from "../../components/ServiceBooking/Promises";
import CoupunContainer from "../../components/ServiceBooking/CouponContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const BookServices = () => {
  return (
    <>
      <Navbar />
      <div className={styles.Container}>
        <ServiceHero />
        <QuickCatogary />
        <PopularServices />
        <Promises />
        <CoupunContainer />
      </div>

      <Footer />
    </>
  );
};

export default BookServices;
