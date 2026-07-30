import React, { useRef, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import LineText from "../../components/LineText";
import styles from "../../styles/BookServices/BookServices.module.css";
import ServiceHero from "../../components/ServiceBooking/ServiceHero";
import QuickCatogary from "../../components/ServiceBooking/QuickCategory";
import PopularServices from "../../components/ServiceBooking/PopularServices";
import Promises from "../../components/ServiceBooking/Promises";
import CoupunContainer from "../../components/ServiceBooking/CouponContainer";
import RecentlySearched from "../../components/ServiceBooking/RecentrlySearched";
import ReviewCon from "../../components/ServiceBooking/ReviewCon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const BookServices = () => {
  return (
    <>
      <Navbar />
      <div className={styles.Container}>
        <ServiceHero />
        <QuickCatogary />
        <PopularServices
          PSTagline={"Loved in your neighborhood"}
          PSHeading={"Popular services"}
          PSSubHeading={
            "Highly rated services booked by thousands of happy households."
          }
        />
        <Promises />
        <CoupunContainer />
        <RecentlySearched />

        <PopularServices
          PSCardType={true}
          PSTagline={"Available nearby"}
          PSHeading={"Meet your local experts"}
          PSSubHeading={
            "Professionals with the skills and care your home deserves."
          }
          PSLinkText={"View all professionals"}
          PSLink={"/Professionals"}
        />
        <ReviewCon />
      </div>

      <Footer />
    </>
  );
};

export default BookServices;
