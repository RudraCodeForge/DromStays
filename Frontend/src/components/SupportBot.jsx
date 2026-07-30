import { useState, useEffect, useRef } from "react";
import Styles from "../styles/Support/SupportBot.module.css";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

/* ============================= */
/* CATEGORIZED ANSWERS */
/* ============================= */
const categorizedAnswers = {
  OWNER: {
    "Property Management": {
      "How to add a property?":
        "Go to Dashboard → Add Property → Fill details → Save.",
      "How to add rooms?": "Open Property → Add Room → Enter room details.",
      "How to manage bookings?": "Go to Dashboard → Bookings section.",
    },
    "Room Management": {
      "Tenant not adding?":
        "Check room capacity. Tenants cannot exceed capacity.",
    },
    "Help Ticket": {
      "Where Can I See My Created Tickets?":
        "After creating a ticket, go to Help Center → Then go to View Tickets.",

      "How Can I Create a New Ticket?":
        "First, go to Help Center → Check if your issue is listed there. If your issue is not listed, click Raise a Support Ticket.",
    },
  },

  USER: {
    "Room Booking": {
      "How to book a room?":
        "Open a property → View rooms → Select room → Book.",
      "How to cancel booking?": "Go to My Bookings → Cancel booking.",
    },
    "Payment Issues": {
      "Payment issue":
        "If payment is deducted but booking failed, wait 24 hours for auto-refund.",
    },
    "Service Booking": {
      "How to book a service?":
        "Go to Services → Select service → Choose provider → Book now.",
      "Service booking cancelled":
        "Go to My Bookings → View booking → Click Cancel to refund.",
      "Service provider not arriving?":
        "Contact support immediately. We'll help you find an alternative provider.",
    },
    "Service Quality & Ratings": {
      "How to rate a service?":
        "After service completion, go to My Bookings → Leave review and rating.",
      "Service quality issue":
        "Report the issue in 24 hours with photo evidence for proper resolution.",
    },
    "Help Ticket": {
      "Where Can I See My Created Tickets?":
        "After creating a ticket, go to Help Center → Then go to View Tickets.",

      "How Can I Create a New Ticket?":
        "First, go to Help Center → Check if your issue is listed there. If your issue is not listed, click Raise a Support Ticket.",
    },
  },

  PARTNER: {
    "Service Management": {
      "How to register service?":
        "Go to Dashboard → My Services → Add Service.",
      "How to update service details?":
        "Go to My Services → Edit Service → Update info → Save changes.",
      "How to update availability?":
        "Go to Dashboard → Availability → Update your working schedule.",
    },
    "Booking Management": {
      "How to accept requests?":
        "Go to Dashboard → Service Requests → Accept or Reject requests.",
      "How to mark service completed?":
        "Open Active Jobs → Select Job → Mark as Completed.",
      "How to cancel a service booking?":
        "Go to Active Bookings → Select booking → Click Cancel with reason.",
      "Service refund process":
        "Cancellations within 2 hours get full refund. After that, customer decides.",
    },
    "Ratings & Complaints": {
      "How to manage service ratings?":
        "Go to Dashboard → My Profile → View all customer reviews and ratings.",
      "Customer complaint received":
        "Go to Dashboard → Support → Check complaint details and respond within 24 hours.",
    },
    "Payments & Earnings": {
      "How to view earnings?": "Go to Dashboard → Earnings section.",
      "Payment not received?":
        "Payments are processed after successful service completion. Contact support if delayed.",
    },
    "Account & Compliance": {
      "Account suspension or warning":
        "Check your email for details. Go to Dashboard → Support to appeal or resolve issues.",
    },
    "Help Ticket": {
      "Where Can I See My Created Tickets?":
        "After creating a ticket, go to Help Center → Then go to View Tickets.",

      "How Can I Create a New Ticket?":
        "First, go to Help Center → Check if your issue is listed there. If your issue is not listed, click Raise a Support Ticket.",
    },
  },

  GUEST: {
    "Getting Started": {
      "How to create account?":
        "Click on Signup → Fill details → Verify email.",
      "Can I browse rooms without login?":
        "Yes, you can browse properties and rooms without login.",
      "How to contact support?": "Use Help Center or Contact Support page.",
    },
  },
};

const SupportBot = () => {
  const { role, isAuthenticated } = useSelector((state) => state.auth);

  /* ============================= */
  /* ROLE DETECTION */
  /* ============================= */
  const userRole = isAuthenticated
    ? role === "owner"
      ? "OWNER"
      : role === "partner"
        ? "PARTNER"
        : "USER"
    : "GUEST";

  const roleAnswers = categorizedAnswers[userRole];

  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState("category"); // category | chat | feedback | fallback
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [typing, setTyping] = useState(false);

  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi 👋 I am Rudra. How can I help you today?",
    },
  ]);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  /* ============================= */
  /* HANDLE CATEGORY */
  /* ============================= */
  const handleCategory = (category) => {
    setMessages((prev) => [...prev, { from: "user", text: category }]);
    setSelectedCategory(category);
    setStage("chat");
  };

  /* ============================= */
  /* HANDLE QUESTION */
  /* ============================= */
  const handleQuestion = (question) => {
    setMessages((prev) => [...prev, { from: "user", text: question }]);
    setTyping(true);

    const answer =
      roleAnswers[selectedCategory][question] ||
      "Sorry 😔 I don't have an answer for that yet.";

    setTimeout(() => {
      setTyping(false);

      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: answer,
        },
        {
          from: "bot",
          text: "Did this solve your problem?",
        },
      ]);

      setStage("feedback");
    }, 1200);
  };

  /* ============================= */
  /* HANDLE BACK */
  /* ============================= */
  const handleBack = () => {
    setSelectedCategory(null);
    setStage("category");
  };

  /* ============================= */
  /* FEEDBACK YES */
  /* ============================= */
  const handleYes = () => {
    setTyping(true);

    setTimeout(() => {
      setTyping(false);

      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Awesome 😊 Happy to help!",
        },
      ]);

      setTimeout(() => {
        setOpen(false);
        resetBot();
      }, 1200);
    }, 900);
  };

  /* ============================= */
  /* FEEDBACK NO */
  /* ============================= */
  const handleNo = () => {
    setTyping(true);

    setTimeout(() => {
      setTyping(false);

      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Sorry 😔 Please visit Help Center or Contact Support for more help.",
        },
      ]);

      setStage("fallback");
    }, 1000);
  };

  /* ============================= */
  /* RESET BOT */
  /* ============================= */
  const resetBot = () => {
    setStage("category");
    setSelectedCategory(null);

    setMessages([
      {
        from: "bot",
        text: "Hi 👋 I am Rudra. How can I help you today?",
      },
    ]);
  };

  return (
    <>
      {/* Floating Button */}
      <div
        className={Styles.BotButton}
        onClick={() => setOpen((prev) => !prev)}
      >
        💬
      </div>

      {open && (
        <div className={Styles.BotWindow}>
          {/* Header */}
          <div className={Styles.BotHeader}>
            <span>Support Bot</span>

            <button
              onClick={() => {
                setOpen(false);
              }}
            >
              ✕
            </button>
          </div>

          {/* Chat Body */}
          <div className={Styles.BotBody}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.from === "bot" ? Styles.BotMessage : Styles.UserMessage
                }
              >
                {msg.text}
              </div>
            ))}

            {typing && (
              <div className={Styles.Typing}>
                Rudra is typing<span>.</span>
                <span>.</span>
                <span>.</span>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Options */}
          <div className={Styles.BotOptions}>
            {stage === "category" &&
              Object.keys(roleAnswers).map((category, index) => (
                <button key={index} onClick={() => handleCategory(category)}>
                  {category}
                </button>
              ))}

            {stage === "chat" &&
              selectedCategory &&
              Object.keys(roleAnswers[selectedCategory]).map(
                (question, index) => (
                  <button key={index} onClick={() => handleQuestion(question)}>
                    {question}
                  </button>
                ),
              )}

            {stage === "chat" && selectedCategory && (
              <button
                onClick={handleBack}
                style={{
                  background: "#e5e7eb",
                  color: "#374151",
                  marginTop: "8px",
                }}
              >
                ← Back
              </button>
            )}

            {stage === "feedback" && (
              <>
                <button onClick={handleYes}>Yes 👍</button>
                <button onClick={handleNo}>No 👎</button>
              </>
            )}

            {stage === "fallback" && (
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexDirection: "column",
                }}
              >
                <NavLink
                  to="/help-center"
                  className={Styles.HelpBtn}
                  onClick={() => {
                    setOpen(false);
                    resetBot();
                  }}
                >
                  Visit Help Center →
                </NavLink>
                <button
                  onClick={() => {
                    setOpen(false);
                    resetBot();
                  }}
                  style={{
                    background: "#ef4444",
                    color: "white",
                    padding: "10px 16px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#dc2626";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "#ef4444";
                  }}
                >
                  End Chat
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SupportBot;
