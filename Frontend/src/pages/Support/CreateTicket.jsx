import { useRef, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Styles from "../../styles/Support/CreateTicket.module.css";

const CreateTicket = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const categoryRef = useRef(null);
  const subjectRef = useRef(null);
  const messageRef = useRef(null);

  const preselectedCategory = searchParams.get("category");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (preselectedCategory && categoryRef.current) {
      categoryRef.current.value = preselectedCategory;
    }
  }, [preselectedCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const ticketData = {
      category: categoryRef.current.value,
      subject: subjectRef.current.value,
      message: messageRef.current.value,
    };

    console.log("Ticket Data:", ticketData);

    setSuccess("✅ Ticket created successfully. Our team will contact you.");

    categoryRef.current.value = "";
    subjectRef.current.value = "";
    messageRef.current.value = "";

    setLoading(false);
  };

  return (
    <div className={Styles.Container}>
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
        <input ref={subjectRef} required />

        <label>Describe your problem</label>
        <textarea ref={messageRef} rows="5" required />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Ticket"}
        </button>
      </form>
    </div>
  );
};

export default CreateTicket;
