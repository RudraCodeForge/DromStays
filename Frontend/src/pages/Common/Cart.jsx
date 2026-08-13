import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {} from "@fortawesome/free-solid-svg-icons";
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
const Cart = () => {
  const cartItems = useSelector((state) => state.cart.items);
  console.log("Cart Items:", cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
        <CartHeader />
        <div className={styles.cartItemsContainer}>
          <div className={styles.LeftcartItems}>
            <AddedServices cartItems={cartItems} />
          </div>
          <div className={styles.RightcartItems}></div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
