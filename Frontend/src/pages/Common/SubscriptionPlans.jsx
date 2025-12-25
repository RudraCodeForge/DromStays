import styles from "../../styles/SubscriptionPlans.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import { useState, useEffect } from "react";
import { getSubscriptionPlans } from "../../services/Subscription";
import ErrorContainer from "../../components/ErrorContainer";
import PageLoader from "../../components/PageLoader.jsx";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { subscribeToPlan } from "../../services/Subscription";
const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/Login" />;
  }

  const currentPlan = user?.Subscription?.planName || null;

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getSubscriptionPlans();
        setPlans(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load subscription plans. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const Buy_Subscription = async (plan) => {
    if (currentPlan === plan.name) {
      alert("You are already subscribed to this plan.");
      return;
    }
    if (plan.pricing.amount !== 0) {
      alert("Redirecting to payment gateway... (Not implemented)");
      return;
    }
    try {
      const response = await subscribeToPlan(plan.name);
      alert(`Subscription successful: ${response.message}`);
      // Optionally, refresh user data here to reflect new subscription
    } catch (err) {
      console.error(err);
      alert(
        `Subscription failed: ${
          err.response?.data?.message || "Please try again later."
        }`
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className={styles.container}>
        <h2 className={styles.title}>Choose Your Plan</h2>
        <p className={styles.subtitle}>Simple pricing. No hidden charges.</p>

        {error && <ErrorContainer message={error} />}

        {loading && <PageLoader text="Loading subscription plans..." />}

        {!loading && plans.length === 0 && !error && (
          <p className={styles.empty}>No subscription plans available.</p>
        )}

        <div className={styles.grid}>
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`${styles.card} ${plan.popular ? styles.popular : ""}`}
            >
              {plan.popular && (
                <span className={styles.badge}>Most Popular</span>
              )}

              <h3 className={styles.planName}>{plan.name}</h3>
              <p className={styles.price}>{plan.pricing.displayPrice}</p>
              <p className={styles.description}>{plan.description}</p>

              <ul className={styles.featureList}>
                {plan.features?.map((feature, i) => (
                  <li key={i}>✔ {feature}</li>
                ))}
              </ul>

              <button
                onClick={() => Buy_Subscription(plan)}
                className={`${styles.button} ${
                  currentPlan === plan.name ? styles.activeBtn : ""
                }`}
                disabled={currentPlan === plan.name}
              >
                {currentPlan === plan.name
                  ? "Active Plan"
                  : plan.price === "₹0"
                  ? "Get Started"
                  : "Subscribe Now"}
              </button>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SubscriptionPlans;
