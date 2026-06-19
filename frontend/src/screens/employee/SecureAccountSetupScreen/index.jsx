import { toast, ToastContainer } from "react-toastify";
import AppLoginForm from "../../../components/AppLoginForm";
import styles from "./styles.module.css";
import { endpoint, getApiUtil } from "../../../utils/ApiUtil";
import { useNavigate, useSearchParams } from "react-router-dom";
import PATH from "../../../Path";

const SecureAccountSetupScreen = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const handleSubmit = async (data) => {
    try {
      if (data.password != data.reenterPassword) {
        toast.error(`Error: Passwords do not match`);
        return;
      }
      await getApiUtil().post(endpoint.EMPLOYEE.SETUP_ACCOUNT, {
        activateKey: params.get("activateKey"),
        username: data.username,
        password: data.password,
      });
      navigate(PATH.EMPLOYEE.LOGIN);
    } catch (err) {
      toast.error(`Error: ${err?.response?.data.error}`);
    }
  };
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
    {
      type: "password",
      key: "reenterPassword",
      placeHolder: "Reenter Password",
    },
  ];
  return (
    <div className={styles.pageContainer}>
      <AppLoginForm
        fields={fields}
        title={"Sign Up"}
        buttonTitle={"Next"}
        handleSubmit={handleSubmit}
        subTitle={"Please enter your username and password to sign up"}
      />
      <ToastContainer />
    </div>
  );
};

export default SecureAccountSetupScreen;
