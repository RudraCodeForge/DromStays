import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Styles from "../../styles/ManageRequests.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";

const ManageRequests = () => {
  const { user } = useSelector((state) => state.auth);
  const role = user?.Role;

  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // 🔹 Unified Dummy Requests
    const allRequests = [
      {
        id: 1,
        requestType: "visit",
        userId: "U1",
        userName: "Rahul Sharma",
        ownerId: "69578aba2fd82cdab3a087c4",
        propertyName: "Shiv PG",
        roomNo: "101",
        visitDate: "06 Jan 2026",
        visitTime: "03:00 PM",
        message: "Room physically dekhna hai",
        status: "pending",
        ownerResponse: null,
      },
      {
        id: 2,
        requestType: "booking",
        userId: "U1",
        userName: "Rahul Sharma",
        ownerId: "69578aba2fd82cdab3a087c4",
        propertyName: "Shiv PG",
        roomNo: "101",
        message: "Room book karna hai",
        status: "approved",
        ownerResponse: "Room available hai",
      },
      {
        id: 3,
        requestType: "special",
        userId: "U2",
        userName: "Neha Gupta",
        ownerId: "69578aba2fd82cdab3a087c4",
        propertyName: "Shiv PG",
        roomNo: "103",
        message: "Motor subah 5 baje on kar dena",
        status: "rejected",
        ownerResponse: "Electricity rules allow nahi karte",
      },
    ];

    if (role === "owner") {
      setRequests(allRequests.filter((r) => r.ownerId === user.id));
    } else {
      setRequests(allRequests.filter((r) => r.userId === user.id));
    }
  }, [role, user]);

  const approveRequest = (id) => {
    console.log("Approved:", id);
  };

  const rejectRequest = (id) => {
    console.log("Rejected:", id);
  };

  const getRequestLabel = (type) => {
    if (type === "visit") return "Visit Request";
    if (type === "booking") return "Booking Request";
    if (type === "special") return "Special Request";
    return "Request";
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
              <div key={req.id} className={Styles.card}>
                <h3>{getRequestLabel(req.requestType)}</h3>

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

                {req.requestType === "visit" && (
                  <>
                    <p>
                      <strong>Date:</strong> {req.visitDate}
                    </p>
                    <p>
                      <strong>Time:</strong> {req.visitTime}
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

                {/* Owner response visible to user */}
                {req.ownerResponse && role !== "owner" && (
                  <p className={Styles.ownerResponse}>
                    <strong>Owner Response:</strong> {req.ownerResponse}
                  </p>
                )}

                {/* Actions only for owner & pending */}
                {role === "owner" && req.status === "pending" && (
                  <div className={Styles.actions}>
                    <button
                      className={Styles.accept}
                      onClick={() => approveRequest(req.id)}
                    >
                      Approve
                    </button>
                    <button
                      className={Styles.reject}
                      onClick={() => rejectRequest(req.id)}
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
