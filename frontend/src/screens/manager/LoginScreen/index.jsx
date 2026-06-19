import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import AppLoginForm from "../../../components/AppLoginForm";
import PATH from "../../../Path";
import { endpoint, getApiUtil } from "../../../utils/ApiUtil";
import styles from "./styles.module.css";

const Login = () => {
  const navigate = useNavigate();
  const handleSubmit = async (data) => {
    try {
      const phoneNumber = data.phoneNumber;
      await getApiUtil().post(endpoint.MANAGER.CREATE_NEW_ACCESS_CODE, {
        phoneNumber: phoneNumber,
      });
      navigate(`${PATH.MANAGER.VALIDATE}?phoneNumber=${phoneNumber}`);
      toast("Request success");
    } catch (ex) {
      toast.error(`Error: ${ex?.response?.data.error}`);
    }
  };

  const navigateToRegister = () => {
    navigate(PATH.MANAGER.REGISTER);
  };

  const fields = [
    {
      type: "number",
      key: "phoneNumber",
      prefix: "+84",
      placeHolder: "Your Phone Number",
    },
  ];

  return (
    <div className={styles.pageContainer}>
      <AppLoginForm
        fields={fields}
        title={"Sign In"}
        buttonTitle={"Next"}
        optionLinkLabel={"Sign up"}
        handleSubmit={handleSubmit}
        optionHandle={navigateToRegister}
        optionLabel={"Don't having account?"}
        note={"passwordless authentication methods."}
        subTitle={"Please enter your phone to sign in"}
      />
      <ToastContainer />
    </div>
  );
};

export default Login;
