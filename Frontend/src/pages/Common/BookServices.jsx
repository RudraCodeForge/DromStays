import React, { useRef, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import LineText from "../../components/LineText";
import styles from "../../styles/BookServices/BookServices.module.css";
import ServiceHero from "../../components/ServiceBooking/ServiceHero";

const BookServices = () => {
  return (
    <>
      <Navbar />

      <div className="Container">
        <ServiceHero />
      </div>

      <Footer />
    </>
  );
};

export default BookServices;
