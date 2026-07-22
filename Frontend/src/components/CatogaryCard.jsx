import styles from "../styles/BookServices/BookServices.module.css";

function CategoryCard({ icon, name, onClick }) {
  return (
    <div className={styles.catagoryCard} onClick={onClick}>
      <span className={styles.catagorylogo}>{icon}</span>

      <span className={styles.catagoryName}>{name}</span>
    </div>
  );
}

export default CategoryCard;
