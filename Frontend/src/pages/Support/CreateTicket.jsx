import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Styles from "../../styles/Support/CreateTicket.module.css";

const CreateTicket = () => {
  const navigate = useNavigate();

  const categoryRef = useRef(null);
  const subjectRef = useRef(null);
  const messageRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const ticketData = {
      category: categoryRef.current.value,
      subject: subjectRef.current.value,
      message: messageRef.current.value,
    };

    try {
      console.log("Ticket Data:", ticketData);

      setSuccess("✅ Ticket created successfully. Our team will contact you.");

      categoryRef.current.value = "";
      subjectRef.current.value = "";
      messageRef.current.value = "";
    } catch (error) {
      console.error("Ticket creation failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={Styles.Container}>
      {/* 🔙 Back Button */}
      <button
        type="button"
        className={Styles.BackBtn}
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <h1>Raise a Support Ticket</h1>

      {success && <p className={Styles.Success}>{success}</p>}

      <form onSubmit={handleSubmit} className={Styles.Form}>
        <label>Issue Category</label>
        <select ref={categoryRef} required>
          <option value="">Select category</option>
          <option value="booking">Booking Issue</option>
          <option value="tenant">Tenant Issue</option>
          <option value="payment">Payment Issue</option>
          <option value="account">Account / Profile</option>
          <option value="other">Other</option>
        </select>

        <label>Subject</label>
        <input
          type="text"
          ref={subjectRef}
          placeholder="Short title of your issue"
          required
        />

        <label>Describe your problem</label>
        <textarea
          ref={messageRef}
          rows="5"
          placeholder="Explain the issue in detail"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Ticket"}
        </button>
      </form>
    </div>
  );
};

export default CreateTicket;
