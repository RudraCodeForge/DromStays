import { useState } from "react";
import Style from "../styles/ReviewCard.module.css";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const ReviewCard = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  if (!item) return null;

  const rating = item.Rating || 0;
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<FaStar key={i} color="#f1c40f" />);
    } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
      stars.push(<FaStarHalfAlt key={i} color="#f1c40f" />);
    } else {
      stars.push(<FaRegStar key={i} color="#ccc" />);
    }
  }

  return (
    <div className={Style.ReviewCard}>
      <div>
        <img
          className={Style.icon}
          src={item.ProfileImg}
          alt={item.Name}
          width="70"
          height="70"
        />
      </div>

      <h3>{item.Name}</h3>
      <p>{item.Title}</p>

      <p
        className={`${Style.reviewText} ${
          expanded ? Style.expanded : ""
        }`}
      >
        {item.Desc}
      </p>

      {item.Desc?.length > 120 && (
        <button
          className={Style.showMoreBtn}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Show Less" : "Show More"}
        </button>
      )}

      <div className={Style.rating}>{stars}</div>
    </div>
  );
};

export default ReviewCard;