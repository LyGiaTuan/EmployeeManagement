import leftArrow from "../../assets/leftArrow.svg";
import styles from "./styles.module.css";
import { useState } from "react";
import { Oval } from "react-loader-spinner";

const AppLoginForm = ({
  title,
  subTitle,
  fields,
  note,
  optionLabel,
  optionHandle,
  optionLinkLabel,
  handleSubmit,
  buttonTitle,
}) => {
  const [value, setValue] = useState({});
  const [loading, setLoading] = useState();
  const navigateToLink = (e) => {
    e.preventDefault();
    optionHandle();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await handleSubmit(value);
    setLoading(false);
  };
  return (
    <form className={styles.formContainer} onSubmit={onSubmit}>
      <div className={styles.backContainer}>
        <img src={leftArrow} alt="back" />
        <div className={styles.backButtonTitle}>Back</div>
      </div>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.subTitle}>{subTitle}</div>
      {fields.map((field, index) => {
        return (
          <div key={index} className={styles.valueInputContainer}>
            {field.prefix && <div>{field.prefix}</div>}
            <input
              className={styles.valueInput}
              type={field.type}
              value={value[field.key]}
              required
              onChange={(e) => {
                setValue({ ...value, [field.key]: e.target.value });
              }}
              placeholder={field.placeHolder}
            />
          </div>
        );
      })}

      <button
        className={`${styles.submitButton} ${loading && styles.disabledSubmitButton}`}
        disabled={loading}
      >
        {loading ? <Oval width={30} height={30} color="black" /> : buttonTitle}
      </button>
      <div className={styles.note}>{note}</div>
      <div className={styles.option}>
        <div className={styles.optionLabel}>{optionLabel}</div>
        <a href="/" className={styles.optionLink} onClick={navigateToLink}>
          {optionLinkLabel}
        </a>
      </div>
    </form>
  );
};

export default AppLoginForm;
