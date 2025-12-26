import Styles from "../../styles/AddProperty.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ErrorContainer from "../../components/ErrorContainer";

const AddProperty = () => {
  const navigate = useNavigate();

  const MEERUT_BOUNDS = {
    minLat: 28.9,
    maxLat: 29.1,
    minLng: 77.6,
    maxLng: 77.85,
  };

  const isInsideMeerut = (lat, lng) =>
    lat >= MEERUT_BOUNDS.minLat &&
    lat <= MEERUT_BOUNDS.maxLat &&
    lng >= MEERUT_BOUNDS.minLng &&
    lng <= MEERUT_BOUNDS.maxLng;

  const [coords, setCoords] = useState({
    latitude: "",
    longitude: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const getCurrentLocation = () => {
    setErrorMessage("");

    if (!navigator.geolocation) {
      setErrorMessage("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        if (!isInsideMeerut(lat, lng)) {
          setErrorMessage("Currently we are live only in Meerut.");
          return;
        }

        setCoords({ latitude: lat, longitude: lng });
      },
      () => {
        setErrorMessage("Location permission denied.");
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    const lat = parseFloat(coords.latitude);
    const lng = parseFloat(coords.longitude);

    if (
      coords.latitude === "" ||
      coords.longitude === "" ||
      !Number.isFinite(lat) ||
      !Number.isFinite(lng)
    ) {
      setErrorMessage("Please enter valid latitude and longitude.");
      return;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setErrorMessage(
        "Latitude must be between -90 to 90 and Longitude between -180 to 180."
      );
      return;
    }

    if (!isInsideMeerut(lat, lng)) {
      setErrorMessage("Currently we are live only in Meerut.");
      return;
    }

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const payload = {
      name: data.name.trim(),
      propertyType: data.propertyType,
      totalRooms: Number(data.totalRooms),
      location: {
        city: data.city,
        area: data.area,
        address: data.address,
        geo: {
          type: "Point",
          coordinates: [lng, lat],
        },
      },
    };

    console.log("FINAL PAYLOAD 👉", payload);
  };

  return (
    <>
      <Navbar />

      <div className={Styles.container}>
        <div className={Styles.card}>
          <h1>Add New Property</h1>
          <p>List your property so tenants can find it easily nearby</p>

          <ErrorContainer message={errorMessage} />

          <form className={Styles.form} onSubmit={handleSubmit}>
            <div className={Styles.section}>
              <h3>Property Details</h3>
              <input name="name" placeholder="Property Name" required />
              <select name="propertyType" required>
                <option value="">Select type</option>
                <option value="PG">PG</option>
                <option value="Hostel">Hostel</option>
                <option value="Flat">Flat</option>
              </select>
              <input type="number" name="totalRooms" min="1" required />
            </div>

            <div className={Styles.section}>
              <h3>Location</h3>
              <input name="city" required />
              <input name="area" required />
              <textarea name="address" rows="3" />
            </div>

            <div className={Styles.section}>
              <h3>Coordinates (Meerut only)</h3>

              <button
                type="button"
                className={Styles.locationBtn}
                onClick={getCurrentLocation}
              >
                Use My Current Location
              </button>

              <input
                type="text"
                inputMode="decimal"
                placeholder="Latitude"
                value={coords.latitude}
                onChange={(e) =>
                  setCoords((p) => ({ ...p, latitude: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
                }}
                required
              />

              <input
                type="text"
                inputMode="decimal"
                placeholder="Longitude"
                value={coords.longitude}
                onChange={(e) =>
                  setCoords((p) => ({ ...p, longitude: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
                }}
                required
              />
            </div>

            <div className={Styles.actions}>
              <button
                type="button"
                className={Styles.cancelBtn}
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button type="submit" className={Styles.submitBtn}>
                Add Property
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AddProperty;
