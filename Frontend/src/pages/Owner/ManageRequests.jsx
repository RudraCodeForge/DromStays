import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Styles from "../../styles/ManageRequests.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import { getRequestsbyId } from "../../services/Request.service";

const ManageRequests = () => {
  const { user } = useSelector((state) => state.auth);
  const role = user?.Role; // ✅ FIX

  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await getRequestsbyId();
        setRequests(response.data || response);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, []);

  const approveRequest = (id) => {
    console.log("Approved:", id);
  };

  const rejectRequest = (id) => {
    console.log("Rejected:", id);
  };

  const getRequestLabel = (type) => {
    switch (type) {
      case "room_visit":
        return "Room Visit Request";
      case "maintenance":
        return "Maintenance Request";
      case "complaint":
        return "Complaint";
      case "special":
        return "Special Request";
      default:
        return "Request";
    }
  };

  return (
    <>
      <Navbar />
      <div className={Styles.container}>
        <h1>{role === "owner" ? "Incoming Requests" : "My Requests"}</h1>

        {requests.length === 0 ? (
          <p>No requests found.</p>
        ) : (
          <div className={Styles.list}>
            {requests.map((req) => (
              <div key={req._id} className={Styles.card}>
                <h3>{getRequestLabel(req.requestType)}</h3>

                {/* Owner sees tenant name */}
                {role === "owner" && (
                  <p>
                    <strong>User:</strong> {req.userName}
                  </p>
                )}

                <p>
                  <strong>Property:</strong> {req.propertyName}
                </p>

                <p>
                  <strong>Room:</strong> {req.roomNo}
                </p>

                {/* Room visit extra details */}
                {req.requestType === "room_visit" && (
                  <>
                    <p>
                      <strong>Date:</strong>{" "}
                      {req.visitDate
                        ? new Date(req.visitDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <p>
                      <strong>Time Slot:</strong> {req.visitTimeSlot}
                    </p>
                  </>
                )}

                {req.message && (
                  <div className={Styles.messageBox}>
                    <strong>Message:</strong>
                    <p>{req.message}</p>
                  </div>
                )}

                <span className={`${Styles.status} ${Styles[req.status]}`}>
                  {req.status}
                </span>

                {/* Owner response visible to tenant */}
                {req.ownerResponse && role !== "owner" && (
                  <p className={Styles.ownerResponse}>
                    <strong>Owner Response:</strong> {req.ownerResponse}
                  </p>
                )}

                {/* Actions only for OWNER & PENDING */}
                {role === "owner" && req.status === "pending" && (
                  <div className={Styles.actions}>
                    <button
                      className={Styles.accept}
                      onClick={() => approveRequest(req._id)}
                    >
                      Approve
                    </button>
                    <button
                      className={Styles.reject}
                      onClick={() => rejectRequest(req._id)}
                    >
                      Reject
                    </button>
                  </div>
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

export default ManageRequests;
