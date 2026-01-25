import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Styles from "../../styles/ManageRequests.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import { getRequestsbyId, respondToRequest, markCompleted } from "../../services/Request.service";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ManageRequests = () => {
  const { user } = useSelector((state) => state.auth);
  const role = user?.Role;
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);

  // 🔹 Owner response states
  const [activeRequestId, setActiveRequestId] = useState(null);
  const [actionType, setActionType] = useState(""); // approved | rejected
  const [ownerResponse, setOwnerResponse] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await getRequestsbyId();
        setRequests(response.data || response);
        console.log("Fetched requests:", response);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, []);

  // 🔹 Open response box
  const openResponseBox = (id, type) => {
    setActiveRequestId(id);
    setActionType(type);
    setOwnerResponse("");
  };

  // 🔹 Submit owner response
  const submitOwnerResponse = async () => {
    if (!ownerResponse.trim()) {
      toast.warning("Owner response is required");
      return;
    }

    const payload = {
      requestId: activeRequestId,
      status: actionType,
      ownerResponse: ownerResponse,
    };

    try {
      await respondToRequest(payload);

      // ✅ Optimistic UI update
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req._id === activeRequestId
            ? { ...req, status: actionType, ownerResponse }
            : req
        )
      );

      if (actionType === "approved") {
        toast.success("Request approved successfully");
      } else {
        toast.info("Request rejected");
      }

      setActiveRequestId(null);
      setOwnerResponse("");
    } catch (error) {
      console.error("Error responding to request:", error);
      toast.error("Failed to submit response");
    }
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

  const MarkDone = async (requestId) => {
    try {
      await markCompleted(requestId);

      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req._id === requestId
            ? { ...req, isCompleted: true, status: "completed" }
            : req
        )
      );

      toast.success("Request marked as completed");
    } catch (error) {
      console.error("Error marking request as completed:", error);
      toast.error("Failed to mark as completed");
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
            {requests.map((req, index) => (
              <div key={req._id} className={Styles.card} style={{ animationDelay: `${index * 0.1}s` }}>
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

                {/* Tenant sees owner response */}
                {req.ownerResponse && role !== "owner" && (
                  <p className={Styles.ownerResponse}>
                    <strong>Owner Response:</strong> {req.ownerResponse}
                  </p>
                )}

                {req.status === "approved" && role !== "owner" && (
                  <p className={Styles.approvalNote}>
                    Your request has been approved. Please follow any instructions provided by the owner.
                  </p>
                )}

                {req.isCompleted && role !== "owner" && req.reviewEligible === false && (
                  <>
                    <button
                      className={Styles.Markcompleted}
                      onClick={() => MarkDone(req._id)}
                    >
                      Mark as Completed
                    </button>
                  </>
                )}

                {req.isCompleted && role !== "owner" && req.reviewEligible && (
                  <>
                    <p className={Styles.reviewNote}>
                      You can now leave a review for this request.
                    </p>

                    <button
                      className={Styles.reviewButton}
                      onClick={() =>
                        navigate(`/review/${req._id}`, {
                          state: {
                            requestType: req.requestType,
                            roomNo: req.roomNo,
                            propertyName: req.propertyName,
                            referenceId: req.roomId,
                          },
                        })
                      }
                    >
                      Leave a Review
                    </button>

                  </>
                )}




                {/* Owner actions */}

                {role === "owner" && req.status === "pending" && (
                  <div className={Styles.actions}>
                    <button
                      className={Styles.accept}
                      onClick={() =>
                        openResponseBox(req._id, "approved")

                      }
                    >
                      Approve
                    </button>
                    <button
                      className={Styles.reject}
                      onClick={() =>
                        openResponseBox(req._id, "rejected")
                      }
                    >
                      Reject
                    </button>
                  </div>
                )}

                {role === "owner" && req.status === "approved" && req.isCompleted === false && (
                  <button
                    className={Styles.Markcompleted}
                    onClick={() => MarkDone(req._id)}
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            ))}
          </div >
        )}

        {/* 🔹 Owner Response Box */}
        {
          activeRequestId && (
            <div className={Styles.responseBox}>
              <div className={Styles.modalContent}>
                <h3>
                  {actionType === "approved"
                    ? "Approve Request"
                    : "Reject Request"}
                </h3>

                <textarea
                  placeholder="Write owner response..."
                  value={ownerResponse}
                  onChange={(e) => setOwnerResponse(e.target.value)}
                />

                <div className={Styles.actions}>
                  <button onClick={submitOwnerResponse}>Submit</button>
                  <button onClick={() => setActiveRequestId(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )
        }
      </div >
      <Footer />
    </>
  );
};

export default ManageRequests;