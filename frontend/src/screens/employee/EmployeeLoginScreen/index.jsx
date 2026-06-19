import { toast, ToastContainer } from "react-toastify";
import styles from "./styles.module.css";
import AppLoginForm from "../../../components/AppLoginForm";
import { endpoint, getApiUtil, setLocalStorage } from "../../../utils/ApiUtil";
import PATH from "../../../Path";

const EmployeeLoginScreen = () => {
  const fields = [
    {
      type: "text",
      key: "username",
      placeHolder: "Username",
    },
    {
      type: "password",
      key: "password",
      placeHolder: "Password",
    },
  ];

  const handleSubmit = async (data) => {
    try {
      const res = await getApiUtil().post(endpoint.EMPLOYEE.LOGIN, { data });
      setLocalStorage(
        res.data.token,
        phoneNumber,
        res.data.name,
        res.data.role,
      );
      navigate(PATH.MANAGER.EMPLOYEEE);
    } catch (ex) {
      toast.error(`Error: ${ex?.response?.data.error}`);
    }
  };
  return (
    <div className={styles.pageContainer}>
      <AppLoginForm
        fields={fields}
        title={"Sign In"}
        buttonTitle={"Next"}
        handleSubmit={() => {}}
        subTitle={"Please enter your username and password to sign in"}
      />
      <ToastContainer />
    </div>
  );
};

export default EmployeeLoginScreen;
