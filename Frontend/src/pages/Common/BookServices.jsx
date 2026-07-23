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
import { recentlySearched } from "../../data/recentlySearched";
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

        <div className={styles.RecentlySearchedCon}>
          <div className={styles.RecentlySearchedConleft}>
            <span className={styles.tagline}>SAVED FOR LATER</span>
            <span className={styles.Heading}>Recently searched</span>
            <span className={styles.SubHeading}>
              Pick up where you left off.
            </span>
            <div className={styles.RecentlySearchedBadges}>
              {recentlySearched.map((item) => (
                <span key={item.id} className={styles.RecentlySearchedBadge}>
                  {item.name}
                </span>
              ))}
            </div>
          </div>
          <div className={styles.RecentlySearchedConRight}>
            <span className={styles.tagline}>
              Your next service is closer than you think
            </span>
            <span className={styles.Heading}>
              Trusted help is available in your neighborhood today.
            </span>
            <NavLink to="/services" className={styles.tagline}>
              Explore nearby pros →
            </NavLink>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default BookServices;
