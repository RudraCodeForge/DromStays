import Styles from "../styles/ErrorContainer.module.css";

const ErrorContainer = ({ message }) => {
  if (!message || message.length === 0) return null;

  return (
    <div className={Styles.ErrorContainer}>
      {Array.isArray(message) ? (
        <ul>
          {message.map((err, index) => (
            <li key={index}>{err}</li>
          ))}
        </ul>
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
};

export default ErrorContainer;
