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
  const [pincodeLoading, setPincodeLoading] = useState(false);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Auto-fetch city and state when pincode is entered
    if (name === "pincode" && value.length === 6) {
      fetchCityAndState(value);
    }
  };

  const fetchCityAndState = async (pincode) => {
    setPincodeLoading(true);
    try {
      // Using India Post API to fetch city/state from pincode
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`,
      );
      const data = await response.json();

      if (data[0].Status === "Success" && data[0].PostOffice) {
        const postOffice = data[0].PostOffice[0];
        setFormData((prevData) => ({
          ...prevData,
          city: postOffice.District || "",
          state: postOffice.State || "",
        }));
      } else {
        alert("Invalid pincode. Please enter a valid pincode.");
        setFormData((prevData) => ({
          ...prevData,
          city: "",
          state: "",
        }));
      }
    } catch (error) {
      console.error("Error fetching city and state:", error);
      alert("Failed to fetch location details. Please enter manually.");
    } finally {
      setPincodeLoading(false);
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30); // Minimum 30 mins from now
    return now.toISOString().slice(0, 16);
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    // Validate form data
    if (!formData.address.trim()) {
      alert("Please enter your address");
      return;
    }
    if (!formData.pincode.trim() || formData.pincode.length !== 6) {
      alert("Please enter a valid 6-digit pincode");
      return;
    }
    if (!formData.city.trim()) {
      alert("Please enter your city");
      return;
    }
    if (!formData.state.trim()) {
      alert("Please enter your state");
      return;
    }
    if (!formData.mobileNumber.trim()) {
      alert("Please enter your mobile number");
      return;
    }
    if (!formData.emailId.trim()) {
      alert("Please enter your email ID");
      return;
    }
    if (!formData.serviceDate.trim()) {
      alert("Please select a service date");
      return;
    }
    if (!formData.serviceTime.trim()) {
      alert("Please select a service time");
      return;
    }
    // Validate mobile number format (basic validation for 10 digits)
    if (!/^\d{10}$/.test(formData.mobileNumber.replace(/[^\d]/g, ""))) {
      alert("Please enter a valid mobile number (10 digits)");
      return;
    }
    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailId)) {
      alert("Please enter a valid email address");
      return;
    }
    // Validate date and time are not in the past
    const selectedDateTime = new Date(
      `${formData.serviceDate}T${formData.serviceTime}`,
    );
    const minDateTime = new Date();
    minDateTime.setMinutes(minDateTime.getMinutes() + 30);
    if (selectedDateTime < minDateTime) {
      alert(
        "Please select a service date and time at least 30 minutes from now",
      );
      return;
    }
    console.log("Form Data:", formData);
    // Form is valid, you can proceed with checkout or save this data
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

              <div className={styles.AddressContainer}>
                <h3 className={styles.addressTitle}>
                  Delivery Address & Contact
                </h3>
                <form
                  className={styles.AddressForm}
                  onSubmit={handleAddressSubmit}
                >
                  <div className={styles.formGroup}>
                    <label htmlFor="address">Full Address *</label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your complete address (Street, City, State, Postal Code)"
                      rows="3"
                      className={styles.textarea}
                    />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="pincode">Pincode *</label>
                      <input
                        type="text"
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="Enter 6-digit pincode"
                        maxLength="6"
                        className={styles.input}
                      />
                      {pincodeLoading && (
                        <span className={styles.loadingText}>
                          Fetching location...
                        </span>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="city">City *</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City will auto-fetch or enter manually"
                        className={styles.input}
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="state">State *</label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="State will auto-fetch or enter manually"
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="mobileNumber">Mobile Number *</label>
                      <input
                        type="tel"
                        id="mobileNumber"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleInputChange}
                        placeholder="Enter 10-digit mobile number"
                        maxLength="10"
                        className={styles.input}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="emailId">Email ID *</label>
                    <input
                      type="email"
                      id="emailId"
                      name="emailId"
                      value={formData.emailId}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="serviceDate">Service Date *</label>
                      <input
                        type="date"
                        id="serviceDate"
                        name="serviceDate"
                        value={formData.serviceDate}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split("T")[0]}
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="serviceTime">Service Time *</label>
                      <input
                        type="time"
                        id="serviceTime"
                        name="serviceTime"
                        value={formData.serviceTime}
                        onChange={handleInputChange}
                        min={getMinDateTime()}
                        className={styles.input}
                      />
                    </div>
                  </div>

                  <button type="submit" className={styles.submitButton}>
                    Save Address
                  </button>
                </form>
              </div>
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
