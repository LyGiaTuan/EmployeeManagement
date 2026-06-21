import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import AppLoginForm from "../../../components/AppLoginForm";
import PATH from "../../../Path";
import { endpoint, getApiUtil, setToken } from "../../../utils/ApiUtil";
import styles from "./styles.module.css";
import { useContext } from "react";
import SocketContext from "../../../contexts/SocketContext";

const EmployeeLoginScreen = () => {
  const navigate = useNavigate();
  const socketClient = useContext(SocketContext);
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
      const res = await getApiUtil().post(endpoint.EMPLOYEE.LOGIN, data);
      setToken(res.data.token);
      console.log(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      socketClient.auth = { token: res.data.token };
      socketClient.connect();
      navigate(PATH.COMMON.TASK);
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
        handleSubmit={handleSubmit}
        subTitle={"Please enter your username and password to sign in"}
      />
      <ToastContainer />
    </div>
  );
};

export default EmployeeLoginScreen;
