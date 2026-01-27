import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Styles from "../../styles/Support/TicketDetails.module.css";
import {
  GetTicketDetails,
  SendTicketMessage,
} from "../../services/Support.service.js";
import { toast } from "react-toastify";

const TicketDetails = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");

  /* ================= FETCH TICKET ================= */
  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const response = await GetTicketDetails(ticketId);

        if (response?.success) {
          setTicket(response.data.ticket);

          setMessages(
            response.data.messages.map((msg) => ({
              sender: msg.sender,
              message: msg.message,
              createdAt: new Date(msg.createdAt).toLocaleString(),
            }))
          );
        }
      } catch (error) {
        toast.error("Failed to fetch ticket details");
      }
    };

    fetchTicketDetails();
  }, [ticketId]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= SEND MESSAGE ================= */
  const handleSend = () => {
    if (!reply.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        message: reply,
        createdAt: "Now",
      },
    ]);

    setReply("");

    // 🔥 Backend later:
    try {
      SendTicketMessage(ticketId, reply);
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  /* ================= SAFE DERIVED VALUES ================= */
  const statusLabel = ticket?.status ? ticket.status.replace("_", " ") : "";

  const statusClass = ticket?.status ? Styles[ticket.status] : "";

  const priorityClass = ticket?.priority ? Styles[ticket.priority] : "";

  /* ================= LOADING STATE ================= */
  if (!ticket) {
    return (
      <div className={Styles.Container}>
        <p className={Styles.Loading}>Loading ticket details...</p>
      </div>
    );
  }

  return (
    <div className={Styles.Container}>
      {/* 🔙 Back */}
      <button className={Styles.BackBtn} onClick={() => navigate(-1)}>
        ← Back to My Tickets
      </button>

      {/* ===== Ticket Summary ===== */}
      <div className={Styles.SummaryCard}>
        <div className={Styles.TopRow}>
          <h2>{ticket.subject}</h2>

          <span className={`${Styles.Status} ${statusClass}`}>
            {statusLabel}
          </span>
        </div>

        <div className={Styles.Meta}>
          <span>
            <b>ID:</b> {ticket.ticketId}
          </span>

          <span>
            <b>Category:</b> {ticket.category}
          </span>

          <span className={`${Styles.Priority} ${priorityClass}`}>
            {ticket.priority}
          </span>

          <span>
            <b>Created:</b> {new Date(ticket.createdAt).toLocaleString()}
          </span>
        </div>
      </div>

      {/* ===== Messages ===== */}
      <div className={Styles.ChatBox}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={
              msg.sender === "user"
                ? Styles.UserMsg
                : msg.sender === "bot"
                  ? Styles.BotMsg
                  : Styles.SupportMsg
            }
          >
            <p>{msg.message}</p>
            <span>{msg.createdAt}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* ===== Reply ===== */}
      {ticket.status !== "RESOLVED" ? (
        <div className={Styles.ReplyBox}>
          <textarea
            placeholder="Type your message..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      ) : (
        <div className={Styles.Closed}>✅ This ticket is resolved.</div>
      )}
    </div>
  );
};

export default TicketDetails;
