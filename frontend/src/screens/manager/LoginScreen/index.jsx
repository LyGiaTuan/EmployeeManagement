import AppLoginForm from "../../../components/AppLoginForm";
import styles from "./styles.module.css";
import { getApiUtil, endpoint } from "../../../utils/ApiUtil";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PATH from "../../../Path";

const Login = () => {
  const navigate = useNavigate();
  const handleSubmit = async (phoneNumber) => {
    try {
      await getApiUtil().post(endpoint.MANAGER.CREATE_NEW_ACCESS_CODE, {
        phoneNumber: phoneNumber,
      });
      navigate(`${PATH.MANAGER.VALIDATE}?phoneNumber=${phoneNumber}`);
      toast("Request success");
    } catch (ex) {
      console.log(ex);
      toast.error(`Error: ${ex.message}`);
    }
  };
  const navigateToRegister =() =>{
    navigate(PATH.MANAGER.REGISTER)
  }
  return (
    <div className={styles.pageContainer}>
      <AppLoginForm
        type={"number"}
        title={"Sign In"}
        buttonTitle={"Next"}
        optionLinkLabel={"Sign up"}
        handleSubmit={handleSubmit}
        optionHandle={navigateToRegister}
        placeHolder={"Your Phone Number"}
        optionLabel={"Don't having account?"}
        note={"passwordless authentication methods."}
        subTitle={"Please enter your phone to sign in"}
        prefix={"+84"}
      />
      <ToastContainer />
    </div>
  );
};

export default Login;
