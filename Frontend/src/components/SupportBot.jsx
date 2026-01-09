import { useState, useEffect, useRef } from "react";
import Styles from "../styles/Support/SupportBot.module.css";
import { NavLink } from "react-router-dom";

const botAnswers = {
  "How to add a property?":
    "Go to Dashboard → Add Property → Fill details → Save.",
  "How to add rooms?": "Open Property → Add Room → Enter room details.",
  "Tenant not adding?": "Check room capacity. Tenants cannot exceed capacity.",
  "Payment issue":
    "If payment is deducted but booking failed, wait 24 hours for auto-refund.",
};

const SupportBot = () => {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState("chat"); // chat | feedback | fallback
  const [typing, setTyping] = useState(false);

  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi 👋 I am Rudra,  How can I help you today?" },
  ]);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  /* ============================= */
  /* HANDLE QUESTION */
  /* ============================= */
  const handleQuestion = (question) => {
    setMessages((prev) => [...prev, { from: "user", text: question }]);
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: botAnswers[question] },
        { from: "bot", text: "Did this solve your problem?" },
      ]);
      setStage("feedback");
    }, 1200); // ⏳ typing delay
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
        { from: "bot", text: "Awesome 😊 Happy to help!" },
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
          text: "Sorry 😔 Please visit Help Center or Contact Support.",
        },
      ]);
      setStage("fallback");
    }, 1000);
  };

  /* ============================= */
  /* RESET */
  /* ============================= */
  const resetBot = () => {
    setStage("chat");
    setMessages([
      { from: "bot", text: "Hi 👋 I am Rudra,  How can I help you today?" },
    ]);
  };

  return (
    <>
      {/* Floating Button */}
      <div className={Styles.BotButton} onClick={() => setOpen(!open)}>
        💬
      </div>

      {open && (
        <div className={Styles.BotWindow}>
          {/* Header */}
          <div className={Styles.BotHeader}>
            <span>Support Bot</span>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* Body */}
          <div className={Styles.BotBody}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={
                  msg.from === "bot" ? Styles.BotMessage : Styles.UserMessage
                }
              >
                {msg.text}
              </div>
            ))}

            {/* Typing Indicator */}
            {typing && (
              <div className={Styles.Typing}>
                Support Bot is typing<span>.</span>
                <span>.</span>
                <span>.</span>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Options */}
          <div className={Styles.BotOptions}>
            {stage === "chat" &&
              Object.keys(botAnswers).map((q, i) => (
                <button key={i} onClick={() => handleQuestion(q)}>
                  {q}
                </button>
              ))}

            {stage === "feedback" && (
              <>
                <button onClick={handleYes}>Yes 👍</button>
                <button onClick={handleNo}>No 👎</button>
              </>
            )}

            {stage === "fallback" && (
              <NavLink
                to="/contact_support"
                className={Styles.HelpBtn}
                onClick={() => {
                  setOpen(false);
                  resetBot();
                }}
              >
                Visit Help Center →
              </NavLink>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SupportBot;
