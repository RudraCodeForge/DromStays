import styles from "../../styles/SubscriptionPlans.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import { useState, useEffect } from "react";
import { getSubscriptionPlans } from "../../services/Subscription";
import ErrorContainer from "../../components/ErrorContainer";
import PageLoader from "../../components/PageLoader.jsx";

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getSubscriptionPlans();
        setPlans(data?.subscriptions || data || []);
      } catch (err) {
        console.error("Failed to fetch subscription plans:", err);
        setError("Unable to load subscription plans. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return (
    <>
      <Navbar />

      <div className={styles.container}>
        <h2 className={styles.title}>Choose Your Plan</h2>
        <p className={styles.subtitle}>Simple pricing. No hidden charges.</p>

        {/* 🔴 Error */}
        {error && <ErrorContainer message={error} />}

        {/* ⏳ Loading */}
        {loading && <PageLoader text="Loading subscription plans..." />}

        {/* 📭 Empty State */}
        {!loading && plans.length === 0 && !error && (
          <p>No subscription plans available right now.</p>
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
              <p className={styles.price}>{plan.price}</p>
              <p className={styles.description}>{plan.description}</p>

              <ul className={styles.featureList}>
                {plan.features?.map((feature, i) => (
                  <li key={i}>✔ {feature}</li>
                ))}
              </ul>

              <button className={styles.button}>Subscribe Now</button>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SubscriptionPlans;
