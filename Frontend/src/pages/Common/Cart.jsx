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
import Address from "../../components/Cart/Address";
import { Verify_Coupon } from "../../services/Coupon.service";
const Cart = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const leftCartRef = useRef(null);
  const rightCartRef = useRef(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [couponStatus, setCouponStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [Discount, setDiscount] = useState(0);
  const [maxDiscount, setMaxDiscount] = useState(0);
  const [formData, setFormData] = useState({
    address: "",
    mobileNumber: "",
    emailId: "",
    city: "",
    pincode: "",
    state: "",
    serviceDate: "",
    serviceTime: "",
  });

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

    // Validate address form before checkout
    if (
      !formData.address.trim() ||
      !formData.pincode.trim() ||
      !formData.city.trim() ||
      !formData.state.trim() ||
      !formData.mobileNumber.trim() ||
      !formData.emailId.trim() ||
      !formData.serviceDate.trim() ||
      !formData.serviceTime.trim()
    ) {
      alert(
        "Please fill in all address and service details before proceeding to checkout.",
      );
      return;
    }

    // Create checkout data object
    const checkoutData = {
      services: cartItems.map((item) => ({
        id: item.serviceId,
        name: item.serviceName,
        price: item.price,
        quantity: item.quantity,
        totalPrice: item.price * item.quantity,
      })),
      couponCode: couponStatus === "success" ? couponCode : null,
      discount: couponStatus === "success" ? Discount : 0,
      maxDiscount: couponStatus === "success" ? maxDiscount : 0,
      address: {
        fullAddress: formData.address,
        pincode: formData.pincode,
        city: formData.city,
        state: formData.state,
        mobileNumber: formData.mobileNumber,
        emailId: formData.emailId,
      },
      serviceSchedule: {
        date: formData.serviceDate,
        time: formData.serviceTime,
      },
      pricing: {
        serviceTotal: ServiceTotal,
        platformFee: PlatformFee,
        effectiveDiscount: EffectiveDiscount,
        finalAmount: FinalAmount,
      },
      bookingDate: BookingDate,
      timestamp: new Date().toISOString(),
    };

    // Console log the checkout data
    console.log("=== CHECKOUT DATA ===");
    console.log(checkoutData);
    console.log("=== END CHECKOUT DATA ===");

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

      // Set left div's min-height to right div's height
      const rightHeight = rightEl.scrollHeight;
      leftEl.style.minHeight = `${rightHeight}px`;
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
              className={`${styles.LeftcartItems} ${styles.scrollableCart}`}
            >
              <AddedServices cartItems={cartItems} />
              <SpecialRequest />
              <Address formData={formData} setFormData={setFormData} />
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
