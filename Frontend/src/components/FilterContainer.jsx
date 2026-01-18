import Style from "../styles/Home.module.css";
import { useRef } from "react";

const FilterContainer = ({ onFilter }) => {
  const locationRef = useRef(null);
  const roomTypeRef = useRef(null);
  const billingRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();

    const filters = {
      location: locationRef.current.value,
      roomType: roomTypeRef.current.value,
      billingType: billingRef.current.value,
      nearBy: false,
      coords: null,
    };

    onFilter(filters);
  };

  const handleNearMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const filters = {
          location: "",
          roomType: roomTypeRef.current.value,
          billingType: billingRef.current.value,
          nearBy: true,
          coords: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },
        };

        onFilter(filters);
      },
      () => {
        alert("Location permission denied");
      }
    );
  };

  return (
    <div className={Style.FilterCon}>
      <form className={Style.FilterForm} onSubmit={handleSearch}>
        <input
          ref={locationRef}
          className={Style.Input}
          type="text"
          placeholder="Search by location..."
        />

        <select ref={roomTypeRef} className={Style.RoomType}>
          <option value="">Room Type</option>
          <option value="single">Single</option>
          <option value="double">Double</option>
        </select>

        <select ref={billingRef} className={Style.PriceRange}>
          <option value="">Billing</option>
          <option value="monthly">Monthly</option>
          <option value="daily">Daily</option>
        </select>

        <button className={Style.Btn} type="submit">
          Search
        </button>

        <button type="button" className={Style.Btn} onClick={handleNearMe}>
          Near Me
        </button>
      </form>
    </div>
  );
};

export default FilterContainer;
