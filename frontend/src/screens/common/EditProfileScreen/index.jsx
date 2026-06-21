import { useContext, useState } from "react";
import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FormInput from "../../../components/FormInput";
import SocketContext from "../../../contexts/SocketContext";
import PATH from "../../../Path";
import { clearToken, endpoint, getApiUtil } from "../../../utils/ApiUtil";
import styles from "./styles.module.css";

const EditProfileScreen = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const socketClient = useContext(SocketContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    ...user,
    phoneNumber: user?.phoneNumber.slice(3),
  });
  const fields = [
    {
      label: "Username",
      key: "username",
      readOnly: true,
    },
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
    {
      label: "Status",
      key: "active",
      readOnly: true,
    },
    {
      label: "Password",
      key: "password",
      type: "password",
    },
    {
      label: "Reenter password",
      key: "ReenterPassword",
      type: "password",
    },
  ];
  const updateUser = async () => {
    try {
      setLoading(true);
      await getApiUtil().post(endpoint.COMMON.UPDATE_PROFILE, userData);
      localStorage.clear();
      clearToken();
      socketClient.auth = { token: "" };
      socketClient.disconnect();
      navigate(PATH.EMPLOYEE.LOGIN);
    } catch (ex) {
      toast.error(`Error ${ex?.response?.data?.error}`);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Oval width={30} height={30} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {fields.map((field, index) => {
        return (
          <FormInput
            key={index}
            readOnly={field.readOnly}
            type={field.type}
            value={userData?.[field.key]}
            label={field.label}
            prefix={field.prefix}
            setValue={(value) => {
              setUserData({ ...userData, [field.key]: value });
            }}
          />
        );
      })}
      <button className={styles.updateButton} onClick={updateUser}>
        update
      </button>
    </div>
  );
};

export default EditProfileScreen;
