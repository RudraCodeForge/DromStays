import Styles from "../../styles/Support/Contact.module.css";
import { useRef, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer.jsx";
import { ContactSupport } from "../../services/Support.service.js";
import ErrorContainer from "../../components/ErrorContainer.jsx";
import { toast } from "react-toastify";

const Contact = () => {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const messageRef = useRef(null);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      name: nameRef.current.value.trim(),
      email: emailRef.current.value.trim(),
      message: messageRef.current.value.trim(),
    };

    // 🔒 extra safety
    if (!formData.name || !formData.email || !formData.message) {
      setError("All fields are required.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      await ContactSupport(formData); // API call

      setIsSubmitted(true); // ✅ only on success
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Something went wrong. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className={Styles.contactContainer}>
        {/* 🔴 Error Message */}
        <ErrorContainer message={error} />

        <h1 className={Styles.heading}>Contact Support</h1>

        {isSubmitted ? (
          <div className={Styles.thankYouMessage}>
            <h2>Thank You!</h2>
            <p>
              Your message has been received. Our team will contact you shortly.
            </p>
          </div>
        ) : (
          <form className={Styles.contactForm} onSubmit={handleSubmit}>
            <div className={Styles.formGroup}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                ref={nameRef}
                className={Styles.input}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className={Styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                ref={emailRef}
                className={Styles.input}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className={Styles.formGroup}>
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                ref={messageRef}
                className={Styles.textarea}
                placeholder="Describe your issue..."
                rows="5"
                required
              />
            </div>

            <button
              type="submit"
              className={Styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Submit"}
            </button>
          </form>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Contact;
