import AppImage from "../../../../../components/AppImage";
import styles from "./styles.module.css";

const Conversion = ({
  userId,
  src,
  name,
  message,
  isSender,
  isSelected,
  onClick,
}) => {
  const handleClick = () => {
    onClick(userId);
  };
  return (
    <button
      className={`${styles.container} ${isSelected && styles.isSelected}`}
      onClick={handleClick}
    >
      <div className={styles.infoContainer}>
        <AppImage src={src} />
        <div className={styles.name}>{name}</div>
      </div>
      <div className={styles.message}>
        {isSender && "You: "}
        {message}
      </div>
    </button>
  );
};

export default Conversion;
