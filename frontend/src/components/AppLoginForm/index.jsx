import leftArrow from "../../assets/leftArrow.svg";
import styles from "./styles.module.css";
import { useState } from "react";
import { Oval } from "react-loader-spinner";

const AppLoginForm = ({
  title,
  subTitle,
  type,
  placeHolder,
  note,
  optionLabel,
  optionHandle,
  optionLinkLabel,
  handleSubmit,
  buttonTitle,
  prefix,
}) => {
  const [value, setValue] = useState();
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
      <div className={styles.valueInputContainer}>
        {prefix && <div>{prefix}</div>}
        <input
          className={styles.valueInput}
          type={type}
          value={value}
          required
          onChange={(e) => {
            setValue(e.target.value);
          }}
          placeholder={placeHolder}
        />
      </div>
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
