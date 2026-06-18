import styles from "./styles.module.css";
import PATH from "../../Path";
import blankAvatarIcon from "../../assets/blankAvatarIcon.svg";
import { useLocation, useNavigate } from "react-router-dom";

const SideMenu = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const navigateToLink = (link) => {
    navigate(link);
  };
  const paths = [
    { pathName: PATH.MANAGER.EMPLOYEEE, tabName: "Manage Employee" },
    { pathName: PATH.MANAGER.TASK, tabName: "Manage Task" },
    { pathName: PATH.MANAGER.MESSAGE, tabName: "Message" },
  ];
  return (
    <div className={styles.container}>
      <div className={styles.menuContainer}>
        <div className={styles.brandContainer}>
          <div className={styles.brand}></div>
        </div>
        <nav className={styles.menu}>
          {paths.map((item) => {
            return (
              <a
                href={item.pathName}
                className={`${styles.menuItem} ${location.pathname === item.pathName ? styles.activeMenuItem : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigateToLink(item.pathName);
                }}
              >
                {item.tabName}
              </a>
            );
          })}
        </nav>
      </div>
      <div className={styles.rightContainer}>
        <div className={styles.header}>
          <div className={styles.bell}>bell</div>
          <img src={blankAvatarIcon} className={styles.avatar} alt="avatar" />
        </div>
        {children}
      </div>
    </div>
  );
};

export default SideMenu;
