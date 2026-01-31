import Styles from "../../styles/AddProperty.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ErrorContainer from "../../components/ErrorContainer";
import { Add_Property } from "../../services/Properties.service";
import { useSelector } from "react-redux";

const AddProperty = () => {
  const { isAuthenticated, role, } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  /* 🏢 FLOOR CONFIG (NEW – ONLY ADD) */
  const [totalFloors, setTotalFloors] = useState("1");
  const [floorConfig, setFloorConfig] = useState([{ floor: 1, rooms: "1" }]);

  /* 🔐 AUTH + ROLE CHECK (SAFE) */
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (role !== "owner") {
      navigate("/unauthorized");
    }
  }, [isAuthenticated, role, navigate]);

  /* 📍 Meerut Boundary */
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

  /* 🌍 GEO STATE */
  const [coords, setCoords] = useState({
    latitude: "",
    longitude: "",
  });

  /* ❌ ERROR STATE */
  const [errorMessage, setErrorMessage] = useState("");

  /* 📍 GET CURRENT LOCATION */
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

        setCoords({
          latitude: lat.toFixed(6),
          longitude: lng.toFixed(6),
        });

        if (!isInsideMeerut(lat, lng)) {
          setErrorMessage(
            "Detected location may be inaccurate. Please ensure the property is inside Meerut."
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

  /* 🧾 SUBMIT HANDLER */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const lat = parseFloat(coords.latitude);
    const lng = parseFloat(coords.longitude);

    /* ❌ INVALID COORDINATES */
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      setErrorMessage("Please enter valid latitude and longitude.");
      return;
    }

    /* ❌ EARTH RANGE CHECK */
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setErrorMessage(
        "Latitude must be between -90 to 90 and Longitude between -180 to 180."
      );
      return;
    }

    /* ❌ MEERUT ONLY */
    if (!isInsideMeerut(lat, lng)) {
      setErrorMessage(
        "Property location must be inside Meerut. Please adjust coordinates."
      );
      return;
    }

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const parsedFloorConfig = floorConfig.map((f) => ({
      floor: f.floor,
      rooms: parseInt(f.rooms, 10) || 0,
    }));

    const totalRooms = parsedFloorConfig.reduce((sum, f) => sum + f.rooms, 0);

    const payload = {
      name: data.name.trim(),
      propertyType: data.propertyType,
      totalRooms: totalRooms,
      floorConfig: parsedFloorConfig,
      location: {
        city: data.city.trim(),
        area: data.area.trim(),
        address: data.address.trim(),
        geo: {
          type: "Point",
          coordinates: [lng, lat], // ✅ GeoJSON order
        },
      },
    };

    try {
      await Add_Property(payload);
      navigate("/owner/properties");
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Failed to add property."
      );
    }
  };

  /* 🏢 FLOOR CONFIG HANDLERS (NEW – ONLY ADD) */

  const handleFloorInput = (value) => {
    if (/^\d*$/.test(value)) setTotalFloors(value);
  };

  const applyFloorChange = () => {
    const floors = parseInt(totalFloors, 10);
    if (!floors || floors < 1) {
      setTotalFloors("1");
      return;
    }

    const updated = [];
    for (let i = 1; i <= floors; i++) {
      const existing = floorConfig.find((f) => f.floor === i);
      updated.push(existing || { floor: i, rooms: "1" });
    }

    setTotalFloors(String(floors));
    setFloorConfig(updated);
  };

  const updateRooms = (floor, value) => {
    if (!/^\d*$/.test(value)) return;
    setFloorConfig((prev) =>
      prev.map((f) => (f.floor === floor ? { ...f, rooms: value } : f))
    );
  };

  return (
    <>
      <Navbar />

      <div className={Styles.container}>
        <div className={Styles.card}>
          <h1>Add New Property</h1>
          <p>List your property so tenants can find it easily</p>

          <ErrorContainer message={errorMessage} />

          <form className={Styles.form} onSubmit={handleSubmit}>
            {/* 🏠 PROPERTY DETAILS */}
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
                  <option value="Room">Room</option>
                </select>
              </div>
            </div>

            {/* 🏢 FLOOR CONFIG (NEW – ONLY ADD THIS) */}
            <div className={Styles.section}>
              <h3>🏢 Floor Configuration</h3>

              <div className={Styles.formGroup}>
                <label>Total Floors</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={totalFloors}
                  onChange={(e) => handleFloorInput(e.target.value)}
                  onBlur={applyFloorChange}
                />
              </div>

              {floorConfig.map((f) => (
                <div key={f.floor} className={Styles.formGroup}>
                  <label>Rooms on Floor {f.floor}</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={f.rooms}
                    onChange={(e) => updateRooms(f.floor, e.target.value)}
                  />
                </div>
              ))}
            </div>

            {/* 📍 LOCATION DETAILS */}
            <div className={Styles.section}>
              <h3>📍 Location Details</h3>

              <div className={Styles.grid}>
                <div className={Styles.formGroup}>
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    defaultValue="Meerut"
                    required
                  />
                </div>

                <div className={Styles.formGroup}>
                  <label>Area</label>
                  <input
                    type="text"
                    name="area"
                    placeholder="Khaduli, Bhola Road"
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
                  required
                />
              </div>
            </div>

            {/* 🗺️ GEO LOCATION */}
            <div className={Styles.section}>
              <h3>🗺️ Map Coordinates</h3>
              <p className={Styles.helper}>
                Used for nearby & location-based search
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
                    required
                  />
                </div>
              </div>
            </div>

            {/* 🔘 ACTIONS */}
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
