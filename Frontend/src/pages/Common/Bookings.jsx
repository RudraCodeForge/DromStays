import Styles from "../../styles/Bookings.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import { useSelector } from "react-redux";
import { useState, useEffect, useMemo } from "react";
import { Navigate } from "react-router-dom";
import PageLoader from "../../components/PageLoader";
import { get_Bookings } from "../../services/Bookings.service";

const Bookings = () => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  const [roomBookings, setRoomBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 🔍 FILTER STATES */
  const [statusFilter, setStatusFilter] = useState("all");
  const [roomFilter, setRoomFilter] = useState("");

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

  /* 🧠 FILTERED BOOKINGS */
  const filteredBookings = useMemo(() => {
    return roomBookings.filter((booking) => {
      const statusMatch =
        statusFilter === "all" || booking.status === statusFilter;

      const roomMatch = roomFilter
        ? booking.room?.roomNumber
          ?.toString()
          .toLowerCase()
          .includes(roomFilter.toLowerCase())
        : true;

      return statusMatch && roomMatch;
    });
  }, [roomBookings, statusFilter, roomFilter]);

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
          {role === "owner" ? "Property Bookings" : "My Bookings"}
        </h1>

        {/* 🔎 FILTER BAR */}
        <div className={Styles.filterBar}>
          <select
            className={Styles.select}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="ended">Ended</option>
          </select>

          <input
            type="text"
            placeholder="Search by Room No"
            className={Styles.input}
            value={roomFilter}
            onChange={(e) => setRoomFilter(e.target.value)}
          />
        </div>

        {filteredBookings.length === 0 ? (
          <div className={Styles.emptyBox}>
            😕 No bookings found
          </div>
        ) : (
          <div className={Styles.grid}>
            {filteredBookings.map((booking) => (
              <div key={booking._id} className={Styles.card}>
                <div className={Styles.cardHeader}>
                  <span
                    className={`${Styles.badge} ${booking.status === "active"
                      ? Styles.active
                      : Styles.inactive
                      }`}
                  >
                    {booking.status.toUpperCase()}
                  </span>
                </div>

                <h3 className={Styles.roomTitle}>
                  🏠 Room {booking.room?.roomNumber || "N/A"}
                </h3>

                <div className={Styles.infoGrid}>
                  <div>
                    <span>📅 Booking Date</span>
                    <p>
                      {new Date(
                        booking.bookingDate
                      ).toDateString()}
                    </p>
                  </div>

                  <div>
                    <span>💰 Rent</span>
                    <p>₹{booking.rentAmount}</p>
                  </div>

                  <div>
                    <span>💳 Advance</span>
                    <p>₹{booking.advanceAmount}</p>
                  </div>

                  <div>
                    <span>⏳ Due</span>
                    <p>₹{booking.totalDue}</p>
                  </div>
                </div>

                <div className={Styles.userBox}>
                  <p>
                    👤 Tenant: <b>{booking.tenant?.fullName}</b>
                  </p>
                  <p>
                    🏢 Owner: <b>{booking.owner?.Name}</b>
                  </p>
                </div>

                {role === "tenant" ? (
                  <div className={Styles.OwnerContact}>
                    <p>
                      📧 Owner Email <b>{booking.owner?.Email}</b>
                    </p>
                    <p>
                      📞 Owner Phone <b>{booking.owner?.Phone}</b>
                    </p>
                  </div>

                ) : (<div className={Styles.OwnerContact}>
                  <p>
                    📧 Tanent Email <b>{booking.tenant?.email}</b>
                  </p>
                  <p>
                    📞 Tanent Phone <b>{booking.tenant?.phone}</b>
                  </p>
                </div>)
                }

                {booking.agreementPdf && (
                  <button
                    className={Styles.downloadBtn}
                    onClick={() => {
                      let pdfPath = booking.agreementPdf;

                      if (pdfPath.includes("storage")) {
                        pdfPath =
                          "/storage/" +
                          pdfPath
                            .split("storage")[1]
                            .replace(/\\/g, "/");
                      }

                      const url = `${import.meta.env.VITE_API_URL}${pdfPath}`;
                      window.open(
                        url,
                        "_blank",
                        "noopener,noreferrer"
                      );
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
