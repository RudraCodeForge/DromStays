import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
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
import SpecialRequest from "../../components/Cart/SpecialRequest";
import BookingSummary from "../../components/Cart/BookingSummary";
import { Verify_Coupon } from "../../services/Coupon.service";
const Cart = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const leftCartRef = useRef(null);
  const rightCartRef = useRef(null);
  const [isLeftTaller, setIsLeftTaller] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [couponStatus, setCouponStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [Discount, setDiscount] = useState(0);
  const [maxDiscount, setMaxDiscount] = useState(0);
  const ServiceTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const PlatformFee = 49;
  const TotalAmount = ServiceTotal + PlatformFee;
  const CalculatedDiscount =
    couponStatus === "success" ? (TotalAmount * Discount) / 100 : 0;
  const EffectiveDiscount = Math.min(CalculatedDiscount, maxDiscount);
  const FinalAmount = TotalAmount - EffectiveDiscount;
  const handleClearCart = () => {
    if (cartItems.length === 0) return;

    const confirmed = window.confirm(
      "Are you sure you want to clear your cart?",
    );
    if (confirmed) {
      dispatch(clearCart());
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setCouponMessage("");
    setCouponStatus("");
    setDiscount(0);
    setMaxDiscount(0);
  };
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponMessage("Please enter a coupon code");
      setCouponStatus("error");
      return;
    }
    console.log("Coupon Code:", couponCode);
    setIsLoading(true);
    setCouponMessage("");
    setCouponStatus("loading");
    try {
      const response = await Verify_Coupon(couponCode);
      if (response.success) {
        setCouponMessage(response.message);
        setCouponStatus("success");
        setDiscount(response.discount);
        setMaxDiscount(response.maxDiscount || 0);
      } else {
        setCouponMessage(response.message);
        setCouponStatus("error");
      }
    } catch (error) {
      console.error("Error verifying coupon:", error);
      setCouponMessage(error.message || "Failed to verify coupon");
      setCouponStatus("error");
    } finally {
      setIsLoading(false);
    }
  };
  const currentDate = new Date();
  const BookingDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add items to proceed to checkout.");
      return;
    }
    navigate("/checkout", {
      state: {
        cartItems,
        ServiceTotal,
        PlatformFee,
        EffectiveDiscount,
        FinalAmount,
        BookingDate,
        couponCode: couponStatus === "success" ? couponCode : null,
      },
    });
  };

  useEffect(() => {
    const updateLayout = () => {
      const leftEl = leftCartRef.current;
      const rightEl = rightCartRef.current;

      if (!leftEl || !rightEl) return;

      setIsLeftTaller(leftEl.scrollHeight > rightEl.scrollHeight);
    };

    updateLayout();

    const resizeObserver = new ResizeObserver(updateLayout);

    if (leftCartRef.current) resizeObserver.observe(leftCartRef.current);
    if (rightCartRef.current) resizeObserver.observe(rightCartRef.current);

    window.addEventListener("resize", updateLayout);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateLayout);
    };
  }, [cartItems]);

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
            <div
              ref={leftCartRef}
              className={`${styles.LeftcartItems} ${
                isLeftTaller ? styles.scrollableCart : ""
              }`}
            >
              <AddedServices cartItems={cartItems} />
              <SpecialRequest />
            </div>
            <div ref={rightCartRef} className={styles.RightcartItems}>
              <BookingSummary
                couponCode={couponCode}
                setCouponCode={setCouponCode}
                couponMessage={couponMessage}
                couponStatus={couponStatus}
                isLoading={isLoading}
                handleApplyCoupon={handleApplyCoupon}
                handleRemoveCoupon={handleRemoveCoupon}
                ServiceTotal={ServiceTotal}
                PlatformFee={PlatformFee}
                EffectiveDiscount={EffectiveDiscount}
                FinalAmount={FinalAmount}
                checkout={handleCheckout}
              />

              <span onClick={handleClearCart} className={styles.clearCart}>
                Clear Cart
              </span>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default Cart;
