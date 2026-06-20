import { useNavigate, useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import AppLoginForm from "../../../components/AppLoginForm";
import PATH from "../../../Path";
import { endpoint, getApiUtil, setToken } from "../../../utils/ApiUtil";
import styles from "./styles.module.css";
import { useContext } from "react";
import SocketContext from "../../../contexts/SocketContext";

const Validate = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const socketClient = useContext(SocketContext)
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
      setToken(res.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(res.data),
      );
      socketClient.auth = { token: res.data.token };
      socketClient.connect()
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
