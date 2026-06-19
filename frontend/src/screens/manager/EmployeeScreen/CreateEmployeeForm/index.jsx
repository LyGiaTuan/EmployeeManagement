import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Oval } from "react-loader-spinner";
import { toast } from "react-toastify";
import { endpoint, getApiUtil } from "../../../../utils/ApiUtil";
import FormInput from "./components/FormInput";
import styles from "./styles.module.css";

const CreateEmployeeForm = ({ showType, employee, setEmployee }) => {
  const [loading, setLoading] = useState(false);
  const fields = [
    {
      label: "Employee Name",
      key: "name",
    },
    {
      label: "Phone Number",
      key: "phoneNumber",
      prefix: "+84",
      type: "number",
    },
    {
      label: "Email Address",
      key: "email",
      type: "email",
    },
    {
      label: "Address",
      key: "address",
    },
  ];
  const checkRef = useRef(false);

  const createEmployee = async () => {
    try {
      setLoading(true);
      await getApiUtil().post(endpoint.MANAGER.CREATE_EMPLOYEE, employee);
      setEmployee({});
      toast("Employee created");
    } catch (err) {
      toast.error(`Error: ${err?.response?.data.error}`);
    } finally {
      setLoading(false);
    }
  };

  const updateEmployee = () => {};

  const handleSubmit = (e) => {
    e.preventDefault();
    employee.id ? updateEmployee() : createEmployee();
  };

  if (!employee) {
    return <></>;
  }

  return createPortal(
    <div
      className={styles.container}
      onClick={() => {
        if (!checkRef.current) {
          setEmployee(undefined);
        }
        checkRef.current = false;
      }}
    >
      <form
        className={styles.form}
        onClick={() => {
          checkRef.current = true;
        }}
        onSubmit={handleSubmit}
      >
        <h1 className={styles.title}>Create Employee</h1>
        <div className={styles.inputsContainer}>
          {fields.map((field, index) => {
            return (
              <FormInput
                key={index}
                type={field.type}
                value={employee[field.key]}
                label={field.label}
                prefix={field.prefix}
                setValue={(value) => {
                  setEmployee({ ...employee, [field.key]: value });
                }}
              />
            );
          })}
        </div>
        <div className={styles.buttonContainer}>
          <button
            className={styles.createButton}
            disabled={loading}
            type={"submit"}
          >
            {loading ? <Oval width={30} height={30} /> : "Create"}
          </button>
        </div>
      </form>
    </div>,
    document.body,
  );
};

export default CreateEmployeeForm;
