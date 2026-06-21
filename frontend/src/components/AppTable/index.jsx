import styles from "./styles.module.css";

const AppTable = ({ list, keys, labels }) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr className={styles.tableHeader}>
          {labels.map((label, index) => (
            <th key={index}>{label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {list.map((item) => (
          <tr key={item.id} className={styles.tableRow}>
            {keys.map((key, index) => (
              <td key={index}>{item[key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AppTable;
