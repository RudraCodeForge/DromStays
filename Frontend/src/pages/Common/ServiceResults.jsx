import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetServiceByCategory } from "../../services/ServiceApi.service";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import ServiceCard from "../../components/Partner/ServiceCard";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
const ServiceResults = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const state = location.state || {};

  useEffect(() => {
    // If caller passed results in location.state, use them
    if (state.results) {
      setResults(state.results);
      return;
    }

    // Otherwise, if query data is provided (serviceName, latitude, longitude), fetch
    const params = state.query;
    console.log("Fetching results with params:", params);
    if (params) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const res = await GetServiceByCategory(params);
          setResults(res);
        } catch (err) {
          setError(err?.message || "Failed to load results");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [state]);

  if (loading) return <div>Loading results...</div>;
  if (error) return <div>{error}</div>;

  const handleBookNow = (service) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }
    const serviceId = service._id || service.id;

    dispatch(
      addToCart({
        serviceId,
        serviceName: service.serviceName,
        price: service.price,
        duration: service.estimatedDuration,
        durationUnit: service.durationUnit,
        unit: service.unit,
        pricingType: service.pricingType,
        ratings: service.rating,
        category: service.category,
        coverImage: service.coverImage,
      }),
    );

    navigate("/cart");
  };

  const handleAddToCart = (service) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }
    const serviceId = service._id || service.id;

    dispatch(
      addToCart({
        serviceId,
        serviceName: service.serviceName,
        price: service.price,
        duration: service.estimatedDuration,
        durationUnit: service.durationUnit,
        unit: service.unit,
        pricingType: service.pricingType,
        ratings: service.rating,
        category: service.category,
        coverImage: service.coverImage,
      }),
    );
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: 20 }}>
        {results ? (
          Array.isArray(results) ? (
            <ServiceCard
              services={results}
              mode="results"
              onBook={handleBookNow}
              onAddToCart={handleAddToCart}
            />
          ) : (
            <ServiceCard
              service={results}
              mode="results"
              onBook={handleBookNow}
              onAddToCart={handleAddToCart}
            />
          )
        ) : (
          <div>No results to display.</div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ServiceResults;
