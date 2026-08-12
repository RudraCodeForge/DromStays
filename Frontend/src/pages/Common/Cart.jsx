import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, fa2, fa3 } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import styles from "../../styles/Cart.module.css";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { clearCart, removeFromCart } from "../../redux/cartSlice";
const Cart = () => {
  const cartItems = useSelector((state) => state.cart.items);
  console.log("Cart Items:", cartItems);
  const dispatch = useDispatch();
  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <>
      <Navbar />
      <div className={styles.cartContainer}>
        <button
          className={styles.backButton}
          onClick={() => window.history.back()}
        >
          &larr; Continue Browsing
        </button>
        <div className={styles.Header}>
          <span className={styles.cartTitle}>BOOKING CART</span>
          <h2 className={styles.cartSubtitle}>Your Services</h2>
          <div className={styles.cartDescriptionContainer}>
            <p className={styles.cartDescription}>
              Review your selected stay and services before confirming.
            </p>
            <div className={styles.SpanContainer}>
              <span
                className={styles.sp1}
                onClick={() => window.history.back()}
              >
                <FontAwesomeIcon icon={faCircleCheck} />
                Selection
              </span>
              <p className={styles.bar}></p>
              <span className={styles.sp2}>
                <FontAwesomeIcon icon={fa2} className={styles.icon} />. Review
              </span>
              <p className={styles.bar2}></p>
              <span className={styles.sp3}>
                <FontAwesomeIcon icon={fa3} className={styles.icon} />. Payment
              </span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
