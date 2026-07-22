import { categories } from "../../data/Catogary";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../../styles/BookServices/BookServices.module.css";
import CategoryCard from "../CatogaryCard";
const QuickCatogary = () => {
  const handleCategoryClick = (serviceName) => {
    const now = new Date();

    const currentDate = now.toLocaleDateString("en-IN");
    const currentTime = now.toLocaleTimeString("en-IN");

    if (!navigator.geolocation) {
      console.log({
        service: serviceName,
        date: currentDate,
        time: currentTime,
        location: "Geolocation not supported",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log({
          service: serviceName,
          date: currentDate,
          time: currentTime,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.log({
          service: serviceName,
          date: currentDate,
          time: currentTime,
          location: "Permission Denied",
          error: error.message,
        });
      },
    );
  };
  return (
    <div className={styles.quickcatogary}>
      <span className={styles.tagline}>EXPLORE BY NEED</span>
      <span className={styles.Heading}>Quick categories</span>
      <span className={styles.SubHeading}>
        Whatever needs doing, there’s an expert ready to help.
      </span>

      <div className={styles.cardContainer}>
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            icon={<FontAwesomeIcon icon={category.icon} />}
            name={category.name}
            onClick={() => handleCategoryClick(category.name)}
          />
        ))}
      </div>
    </div>
  );
};
export default QuickCatogary;
