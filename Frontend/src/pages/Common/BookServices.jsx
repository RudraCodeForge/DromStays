import React, { useRef, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import LineText from "../../components/LineText";
import styles from "../../styles/BookServices/BookServices.module.css";
import ServiceHero from "../../components/ServiceBooking/ServiceHero";
import QuickCatogary from "../../components/ServiceBooking/QuickCategory";
import PopularServices from "../../components/ServiceBooking/PopularServices";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const BookServices = () => {
  return (
    <>
      <Navbar />
      <div className={styles.Container}>
        <ServiceHero />
        <QuickCatogary />
        <PopularServices />
      </div>

      <Footer />
    </>
  );
};

export default BookServices;
