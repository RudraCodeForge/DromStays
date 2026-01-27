import { useState, useEffect } from "react"; // Added useEffect for animation trigger
import { useNavigate } from "react-router-dom";
import Styles from "../../styles/Support/MyTickets.module.css";
import { GetTickets } from "../../services/Support.service.js";
import { toast } from "react-toastify";
const MyTickets = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("ALL");
  const [loaded, setLoaded] = useState(false); // For animation trigger
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    setLoaded(true); // Trigger fade-in after component mounts
  }, []);

  // 🔥 TEMP DATA (backend later)
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await GetTickets();
        if (response.success) {
          setTickets(response.data);
        }
      } catch (error) {
        toast.error("Failed to fetch tickets. Please try again.");
      }
    };

    fetchTickets();
  }, []);

  const filteredTickets =
    filter === "ALL" ? tickets : tickets.filter((t) => t.status === filter);

  return (
    <div className={Styles.Container} data-loaded={loaded}>
      {/* Header */}
      <div className={Styles.Header}>
        <button onClick={() => navigate(-1)} className={Styles.BackBtn}>
          ← Back
        </button>
        <h1>My Support Tickets</h1>
      </div>

      {/* Filters */}
      <div className={Styles.Filters}>
        {["ALL", "open", "in_progress", "resolved", "closed"].map((f) => (
          <button
            key={f}
            className={filter === f ? Styles.ActiveFilter : Styles.FilterBtn}
            onClick={() => setFilter(f)}
          >
            {f.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Ticket List */}
      <div className={Styles.List}>
        {filteredTickets.length === 0 && (
          <p className={Styles.Empty}>No tickets found.</p>
        )}

        {filteredTickets.map((ticket) => (
          <div
            key={ticket._id}
            className={Styles.Card}
            onClick={() => navigate(`/tickets/${ticket._id}`)}
          >
            <div className={Styles.CardTop}>
              <h3>{ticket.subject}</h3>
              <span className={`${Styles.Badge} ${Styles[ticket.status]}`}>
                {ticket.status.replace("_", " ")}
              </span>
            </div>

            <p className={Styles.TicketId}>{ticket.ticketId}</p>

            <div className={Styles.Meta}>
              <span className={Styles.Category}>{ticket.category}</span>
              <span className={`${Styles.Priority} ${Styles[ticket.priority]}`}>
                {ticket.priority}
              </span>
              <span className={Styles.Date}>{ticket.createdAt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTickets;
