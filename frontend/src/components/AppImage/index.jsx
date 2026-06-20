import styles from "./styles.module.css";

const AppImage = ({ src }) => {
  return <img src={src} className={styles.avatar} alt="avatar" />;
};

export default AppImage;
