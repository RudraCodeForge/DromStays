import Style from "../styles/ReviewCard.module.css";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const ReviewCard = ({ item }) => {
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
          src="/profile.webp"
          alt={item.Name}
          width="50px"
          height="50px"
        />
      </div>
      <h3>{item.Name}</h3>
      <p>{item.Title}</p>
      <p>{item.Desc}</p>
      <div className={Style.rating}>{stars}</div>
    </div>
  );
};

export default ReviewCard;
