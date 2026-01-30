import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Styles from "../../styles/ManageRequests.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import {
  getRequestsbyId,
  respondToRequest,
  markCompleted,
} from "../../services/Request.service";
import { toast } from "react-toastify";

const ManageRequests = () => {
  const { user } = useSelector((state) => state.auth);
  const role = user?.Role;
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");

  const [activeRequestId, setActiveRequestId] = useState(null);
  const [actionType, setActionType] = useState("");
  const [ownerResponse, setOwnerResponse] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await getRequestsbyId();
        setRequests(response.data || response);
      } catch {
        toast.error("Failed to fetch requests");
      }
    };
    fetchRequests();
  }, []);

  const filteredRequests =
    statusFilter === "all"
      ? requests
      : requests.filter((req) => req.status === statusFilter);

  const openResponseBox = (id, type) => {
    setActiveRequestId(id);
    setActionType(type);
    setOwnerResponse("");
  };

  const submitOwnerResponse = async () => {
    if (!ownerResponse.trim()) {
      toast.warning("Owner response is required");
      return;
    }

    try {
      await respondToRequest({
        requestId: activeRequestId,
        status: actionType,
        ownerResponse,
      });

      setRequests((prev) =>
        prev.map((req) =>
          req._id === activeRequestId
            ? { ...req, status: actionType, ownerResponse }
            : req
        )
      );

      toast.success(
        actionType === "approved"
          ? "Request approved"
          : "Request rejected"
      );

      setActiveRequestId(null);
      setOwnerResponse("");
    } catch {
      toast.error("Failed to submit response");
    }
  };

  const markAsCompletedByOwner = async (requestId) => {
    try {
      await markCompleted(requestId);

      setRequests((prev) =>
        prev.map((req) =>
          req._id === requestId
            ? {
              ...req,
              isCompleted: true,
              reviewEligible: true,
            }
            : req
        )
      );

      toast.success("Request marked as completed");
    } catch {
      toast.error("Failed to mark request as completed");
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
      default:
        return "Request";
    }
  };

  return (
    <>
      <Navbar />

      <div className={Styles.container}>
        <h1>{role === "owner" ? "Incoming Requests" : "My Requests"}</h1>

        <div className={Styles.filterBar}>
          <label>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {filteredRequests.length === 0 ? (
          <p>No requests found.</p>
        ) : (
          <div className={Styles.list}>
            {filteredRequests.map((req) => (
              <div key={req._id} className={Styles.card}>
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

                <span className={`${Styles.status} ${Styles[req.status]}`}>
                  {req.status}
                </span>

                {/* Tenant: Owner response */}
                {req.ownerResponse && role !== "owner" && (
                  <p className={Styles.ownerResponse}>
                    <strong>Owner Response:</strong> {req.ownerResponse}
                  </p>
                )}

                {/* OWNER ACTIONS */}
                {role === "owner" && req.status === "pending" && (
                  <div className={Styles.actions}>
                    <button
                      className={Styles.accept}
                      onClick={() => openResponseBox(req._id, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      className={Styles.reject}
                      onClick={() => openResponseBox(req._id, "rejected")}
                    >
                      Reject
                    </button>
                  </div>
                )}

                {role === "owner" &&
                  req.status === "approved" &&
                  !req.isCompleted && (
                    <button
                      className={Styles.Markcompleted}
                      onClick={() => markAsCompletedByOwner(req._id)}
                    >
                      Mark as Completed
                    </button>
                  )}

                {/* TENANT REVIEW */}
                {role !== "owner" &&
                  req.isCompleted &&
                  req.reviewEligible && (
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
                      Leave Review
                    </button>
                  )}
              </div>
            ))}
          </div>
        )}

        {activeRequestId && (
          <div className={Styles.responseBox}>
            <div className={Styles.modalContent}>
              <h3>
                {actionType === "approved"
                  ? "Approve Request"
                  : "Reject Request"}
              </h3>

              <textarea
                value={ownerResponse}
                onChange={(e) => setOwnerResponse(e.target.value)}
                placeholder="Write owner response..."
              />

              <div className={Styles.actions}>
                <button onClick={submitOwnerResponse}>Submit</button>
                <button onClick={() => setActiveRequestId(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default ManageRequests;
