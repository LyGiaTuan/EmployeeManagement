import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import PATH from "../../Path";
import blankAvatarIcon from "../../assets/blankAvatarIcon.svg";
import SocketContext from "../../contexts/SocketContext";
import { clearToken } from "../../utils/ApiUtil";
import { ROLE } from "../../utils/RoleEnum";
import AppImage from "../AppImage";
import styles from "./styles.module.css";

const SideMenu = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const navigateToLink = (link) => {
    navigate(link);
  };
  const socketClient = useContext(SocketContext);
  const paths =
    user?.role === ROLE.MANAGER
      ? [
          { pathName: PATH.MANAGER.EMPLOYEEE, tabName: "Manage Employee" },
          { pathName: PATH.MANAGER.TASK, tabName: "Manage Task" },
          { pathName: PATH.COMMON.MESSAGE, tabName: "Message" },
        ]
      : [
          { pathName: PATH.EMPLOYEE.TASK, tabName: "Manage Task" },
          { pathName: PATH.COMMON.MESSAGE, tabName: "Message" },
        ];

  const logout = (e) => {
    e.preventDefault();
    localStorage.clear();
    clearToken();
    socketClient.auth = { token: "" };
    socketClient.disconnect();
    navigate(PATH.EMPLOYEE.LOGIN);
  };

  return (
    <div className={styles.container}>
      <div className={styles.menuContainer}>
        <div className={styles.brandContainer}>
          <div className={styles.brand}></div>
        </div>
        <nav className={styles.menu}>
          {paths.map((item, index) => {
            return (
              <a
                key={index}
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
          <div className={styles.avatarContainer}>
            <AppImage src={blankAvatarIcon} />
            <div className={styles.infoCard}>
              <div>Name: {user?.name}</div>
              <div>Email: {user?.email}</div>
              <div>Phone number: {user?.phoneNumber}</div>
              <a href={"/"} onClick={logout} className={styles.logoutButton}>
                Logout
              </a>
            </div>
          </div>
        </div>
        <div className={styles.contentContainer}>{children}</div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SideMenu;
