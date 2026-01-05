import Styles from "../../styles/Bookings.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import { useSelector } from "react-redux";

const Bookings = ({ bookings = [] }) => {
  const { user } = useSelector((state) => state.auth);

  const isOwner = user?.Role?.toLowerCase() === "owner";

  return (
    <>
      <Navbar />

      <div className={Styles.container}>
        <h1 className={Styles.title}>
          {isOwner ? "Property Bookings" : "My Bookings"}
        </h1>

        {bookings.length === 0 ? (
          <div className={Styles.emptyBox}>There is no booking</div>
        ) : (
          <div className={Styles.grid}>
            {bookings.map((booking) => (
              <div key={booking._id} className={Styles.card}>
                <div className={Styles.cardHeader}>
                  <span className={Styles.badge}>{booking.status}</span>
                </div>

                <h3 className={Styles.property}>{booking.propertyName}</h3>

                <p className={Styles.room}>Room: {booking.roomNumber}</p>

                <p className={Styles.date}>
                  📅 {booking.startDate} → {booking.endDate}
                </p>

                {isOwner ? (
                  <p className={Styles.user}>Tenant: {booking.tenantName}</p>
                ) : (
                  <p className={Styles.user}>Owner: {booking.ownerName}</p>
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
