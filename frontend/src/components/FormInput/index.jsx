import styles from "./style.module.css";

const FormInput = ({
  label,
  value,
  setValue,
  prefix,
  readOnly,
  type = "text",
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.label}>{label}</div>
      <div className={styles.inpuContainer}>
        {prefix && <div className={styles.prefix}>{prefix}</div>}
        <input
          readOnly={readOnly}
          className={styles.input}
          type={type}
          value={value ?? ""}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default FormInput;
