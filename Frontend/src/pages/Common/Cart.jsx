import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import styles from "../../styles/Cart.module.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  clearCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "../../redux/cartSlice";
import CartHeader from "../../components/Cart/CartHeader";
import AddedServices from "../../components/Cart/AddedServices";
import EmptyCart from "../../components/Cart/EmptyCart";
const Cart = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleClearCart = () => {
    dispatch(clearCart());
  };
  return (
    <>
      <Navbar />
      {cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className={styles.cartContainer}>
          <button
            className={styles.backButton}
            onClick={() => window.history.back()}
          >
            &larr; Continue Browsing
          </button>
          <CartHeader />
          <div className={styles.cartItemsContainer}>
            <div className={styles.LeftcartItems}>
              <AddedServices cartItems={cartItems} />

              <div className={styles.RequestContainer}>
                <div className={styles.RequestHeadingCon}>
                  <div className={styles.iconCon}>
                    <FontAwesomeIcon icon={faWandMagicSparkles} />
                  </div>
                  <div className={styles.RequestTextCon}>
                    <h2>Special Requests</h2>
                    <p>We’ll try our best to accommodate you.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.RightcartItems}></div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default Cart;
