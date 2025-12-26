import Styles from "../../styles/AddProperty.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ErrorContainer from "../../components/ErrorContainer";

const AddProperty = () => {
  const navigate = useNavigate();

  // 📍 Meerut boundary
  const MEERUT_BOUNDS = {
    minLat: 27.8,
    maxLat: 29.2,
    minLng: 77.5,
    maxLng: 78.9,
  };

  const isInsideMeerut = (lat, lng) =>
    lat >= MEERUT_BOUNDS.minLat &&
    lat <= MEERUT_BOUNDS.maxLat &&
    lng >= MEERUT_BOUNDS.minLng &&
    lng <= MEERUT_BOUNDS.maxLng;

  // 🔹 Geo state
  const [coords, setCoords] = useState({
    latitude: "",
    longitude: "",
  });

  // ❌ Error state
  const [errorMessage, setErrorMessage] = useState("");

  // 📍 Auto fetch current location
  const getCurrentLocation = () => {
    setErrorMessage("");

    if (!navigator.geolocation) {
      setErrorMessage("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setCoords({
          latitude: lat.toFixed(6),
          longitude: lng.toFixed(6),
        });

        if (!isInsideMeerut(lat, lng)) {
          setErrorMessage(
            "Location detected may be inaccurate. If you are in Meerut, please adjust coordinates manually."
          );
        }
      },
      () => {
        setErrorMessage("Location permission denied.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // 🧾 Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    const lat = parseFloat(coords.latitude);
    const lng = parseFloat(coords.longitude);

    // ❌ Empty / invalid
    if (
      coords.latitude === "" ||
      coords.longitude === "" ||
      !Number.isFinite(lat) ||
      !Number.isFinite(lng)
    ) {
      setErrorMessage("Please enter valid latitude and longitude.");
      return;
    }

    // ❌ Earth range
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setErrorMessage(
        "Latitude must be between -90 to 90 and Longitude between -180 to 180."
      );
      return;
    }

    // ❌ Meerut only
    if (!isInsideMeerut(lat, lng)) {
      setErrorMessage(
        "Property location must be inside Meerut. Please adjust coordinates."
      );
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
          coordinates: [lng, lat], // ✅ GeoJSON order
        },
      },
    };

    console.log("FINAL PAYLOAD 👉", payload);
    // 🔥 API CALL HERE
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
            {/* PROPERTY DETAILS */}
            <div className={Styles.section}>
              <h3>🏠 Property Details</h3>

              <div className={Styles.formGroup}>
                <label>Property Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Eg: Shree PG"
                  required
                />
              </div>

              <div className={Styles.formGroup}>
                <label>Property Type</label>
                <select name="propertyType" required>
                  <option value="">Select type</option>
                  <option value="PG">PG</option>
                  <option value="Hostel">Hostel</option>
                  <option value="Flat">Flat</option>
                </select>
              </div>

              <div className={Styles.formGroup}>
                <label>Total Rooms</label>
                <input
                  type="number"
                  name="totalRooms"
                  min="1"
                  placeholder="Eg: 10"
                  required
                />
              </div>
            </div>

            {/* LOCATION DETAILS */}
            <div className={Styles.section}>
              <h3>📍 Location Details</h3>

              <div className={Styles.grid}>
                <div className={Styles.formGroup}>
                  <label>City</label>
                  <input type="text" name="city" placeholder="City" required />
                </div>

                <div className={Styles.formGroup}>
                  <label>Area</label>
                  <input
                    type="text"
                    name="area"
                    placeholder="Area / Locality"
                    required
                  />
                </div>
              </div>

              <div className={Styles.formGroup}>
                <label>Full Address</label>
                <textarea
                  name="address"
                  placeholder="Near college / landmark"
                  rows="3"
                />
              </div>
            </div>

            {/* GEO LOCATION */}
            <div className={Styles.section}>
              <h3>🗺️ Map Coordinates</h3>
              <p className={Styles.helper}>
                Used for nearby & college-based search
              </p>

              <button
                type="button"
                className={Styles.locationBtn}
                onClick={getCurrentLocation}
              >
                📍 Use My Current Location
              </button>

              <div className={Styles.grid}>
                <div className={Styles.formGroup}>
                  <label>Latitude</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={coords.latitude}
                    onChange={(e) =>
                      setCoords({ ...coords, latitude: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (["e", "E", "+", "-"].includes(e.key))
                        e.preventDefault();
                    }}
                    required
                  />
                </div>

                <div className={Styles.formGroup}>
                  <label>Longitude</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={coords.longitude}
                    onChange={(e) =>
                      setCoords({ ...coords, longitude: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (["e", "E", "+", "-"].includes(e.key))
                        e.preventDefault();
                    }}
                    required
                  />
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className={Styles.actions}>
              <button
                type="button"
                className={Styles.cancelBtn}
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>

              <button type="submit" className={Styles.submitBtn}>
                + Add Property
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
