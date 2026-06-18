import { useNavigate, useSearchParams } from "react-router-dom";
import AppLoginForm from "../../../components/AppLoginForm";
import styles from "./styles.module.css";
import { endpoint, getApiUtil } from "../../../utils/ApiUtil";
import { toast, ToastContainer } from "react-toastify";
import PATH from "../../../Path";

const Validate = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate()
  const handleSumit = async (code) => {
    try {
      const phoneNumber = params.get("phoneNumber");
      await getApiUtil().post(endpoint.MANAGER.VALIDATE_ACCESS_CODE, {
        phoneNumber: phoneNumber,
        code: code,
      });
      navigate(PATH.MANAGER.VALIDATE)
    } catch (ex) {
      toast.error(`Error: ${ex?.response?.data.error}`);
    }
  };
  const sendAgain = async () => {
    try {
      const phoneNumber = params.get("phoneNumber");
      await getApiUtil().post(endpoint.MANAGER.CREATE_NEW_ACCESS_CODE, {
        phoneNumber: phoneNumber,
      });
      toast("Request success");
    } catch (ex) {
      toast.error(`Error: ${ex?.response?.data.error}`);
    }
  };
  return (
    <div className={styles.pageContainer}>
      <AppLoginForm
        type={"number"}
        buttonTitle={"Submit"}
        optionHandle={sendAgain}
        handleSubmit={handleSumit}
        optionLinkLabel={"Send Again"}
        title={"Phone verification"}
        placeHolder={"Enter Your code"}
        optionLabel={"Code not receive?"}
        subTitle={"Please enter your code that send to your phone"}
      />
      <ToastContainer />
    </div>
  );
};

export default Validate;
