import { useNavigate, useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import AppLoginForm from "../../../components/AppLoginForm";
import PATH from "../../../Path";
import { endpoint, getApiUtil, setLocalStorage } from "../../../utils/ApiUtil";
import styles from "./styles.module.css";

const Validate = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const handleSumit = async (data) => {
    try {
      const code = data.code;
      const phoneNumber = params.get("phoneNumber");
      const res = await getApiUtil().post(
        endpoint.MANAGER.VALIDATE_ACCESS_CODE,
        {
          phoneNumber: phoneNumber,
          code: code,
        },
      );
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

  const fields = [
    {
      type: "number",
      key: "code",
      placeHolder: "Enter Your code",
    },
  ];

  return (
    <div className={styles.pageContainer}>
      <AppLoginForm
        fields={fields}
        buttonTitle={"Submit"}
        optionHandle={sendAgain}
        handleSubmit={handleSumit}
        optionLinkLabel={"Send Again"}
        title={"Phone verification"}
        optionLabel={"Code not receive?"}
        subTitle={"Please enter your code that send to your phone"}
      />
      <ToastContainer />
    </div>
  );
};

export default Validate;
