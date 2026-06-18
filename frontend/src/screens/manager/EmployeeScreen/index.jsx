import styles from "./styles.module.css";
import magnifyingGlassIcon from "../../../assets/magnifyingGlassIcon.svg";

const EmployeeScreen = () => {
  return (
    <div className={styles.employeeTableContainer}>
      <div className={styles.labelContainer}>
        <div className={styles.label}>Manage Employee</div>
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.employeeCount}>4 Employee</div>
        <div className={styles.toolsContainer}>
          <button className={styles.createEmployeeButton}>
            + Create Employee
          </button>
          <div className={styles.searchBar}>
            <img
              className={styles.magnifyingGlassIcon}
              src={magnifyingGlassIcon}
              alt={"magnifyingGlassIcon"}
            />
            <input className={styles.searchInput} />
          </div>
        </div>
      </div>
      <table className={styles.employeeTable}>
        <tr className={styles.employeeTableHeader}>
          <th>Employee Name</th>
          <th>Email</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
        <tr className={styles.employeeTableRow}>
          <td>gg</td>
          <td>gg</td>
          <td>
            <div className={styles.status}>Active</div>
          </td>
          <td>
            <div className={styles.buttons}>
              <button className={`${styles.baseButton} ${styles.editButton}`}>Edit</button>
              <button className={`${styles.baseButton} ${styles.deleteButton}`}>Delete</button>
            </div>
          </td>
        </tr>
         <tr className={styles.employeeTableRow}>
          <td>gg</td>
          <td>gg</td>
          <td>
            <div className={styles.status}>Active</div>
          </td>
          <td>
            <div className={styles.buttons}>
              <button className={`${styles.baseButton} ${styles.editButton}`}>Edit</button>
              <button className={`${styles.baseButton} ${styles.deleteButton}`}>Delete</button>
            </div>
          </td>
        </tr>
      </table>
    </div>
  );
};

export default EmployeeScreen;
