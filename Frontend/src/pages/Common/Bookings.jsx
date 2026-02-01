import Styles from "../../styles/Bookings.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import PageLoader from "../../components/PageLoader";
import { get_Bookings } from "../../services/Bookings.service";

const Bookings = () => {
  const { isAuthenticated, Role } = useSelector((state) => state.auth);

  const [roomBookings, setRoomBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  if (!isAuthenticated) {
    return <Navigate to="/Login" replace />;
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await get_Bookings();
      setRoomBookings(res.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings", error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <>
        <Navbar />
        <PageLoader />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className={Styles.container}>
        <h1 className={Styles.title}>
          {Role === "owner" ? "Property Bookings" : "My Bookings"}
        </h1>

        {roomBookings.length === 0 ? (
          <div className={Styles.emptyBox}>There is no booking</div>
        ) : (
          <div className={Styles.grid}>
            {roomBookings.map((booking) => (
              <div key={booking._id} className={Styles.card}>
                <div className={Styles.cardHeader}>
                  <span className={Styles.badge}>{booking.status}</span>
                </div>

                <h3 className={Styles.property}>Room Booking</h3>

                <p className={Styles.room}>
                  Room No: {booking.room?.roomNumber || "N/A"}
                </p>

                <p className={Styles.date}>
                  📅 Booking Date:{" "}
                  {new Date(booking.bookingDate).toDateString()}
                </p>

                <p className={Styles.amount}>
                  💰 Rent: ₹{booking.rentAmount}
                </p>

                <p className={Styles.amount}>
                  💳 Advance: ₹{booking.advanceAmount}
                </p>

                <p className={Styles.amount}>
                  ⏳ Due: ₹{booking.totalDue}
                </p>

                {Role === "owner" ? (
                  <p className={Styles.user}>
                    👤 Tenant: {booking.tenant?.fullName}
                  </p>
                ) : (
                  <p className={Styles.user}>
                    👤 Owner: {booking.owner?.Name}
                  </p>
                )}

                {booking.agreementPdf && (
                  <button
                    className={Styles.downloadBtn}
                    onClick={() => {
                      let pdfPath = booking.agreementPdf;

                      // 🔥 Windows absolute path fix
                      if (pdfPath.includes("storage")) {
                        pdfPath =
                          "/storage/" + pdfPath.split("storage")[1].replace(/\\/g, "/");
                      }

                      const url = `${import.meta.env.VITE_API_URL}${pdfPath}`;

                      window.open(url, "_blank", "noopener,noreferrer");
                    }}
                  >
                    📄 Download Agreement
                  </button>
                )}



              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Bookings;
