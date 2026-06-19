import axios from "axios";

export const endpoint = {
  MANAGER: {
    CREATE_NEW_ACCESS_CODE: "/user/manager/create-new-access-code",
    VALIDATE_ACCESS_CODE: "/user/manager/validate-access-code",
    CREATE_EMPLOYEE: "/user/manager/employee",
    GET_EMPLOYEES: "/user/manager/employee/get-list",
    DELETE_EMPLOYEE: "/user/manager/employee/delete",
  },
  EMPLOYEE: {
    SETUP_ACCOUNT: "/user/employee/setup-account",
    LOGIN: "/user/employee/login",
  },
};

const baseUrl = "http://localhost:5000/";
let apiUtil = axios.create({
  baseURL: baseUrl,
});

const setToken = (token) => {
  apiUtil = axios.create({
    baseURL: baseUrl,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const setLocalStorage = (token, phoneNumber, name, role) => {
  localStorage.setItem("token", token);
  localStorage.setItem("phoneNumber", phoneNumber);
  localStorage.setItem("email", email);
  localStorage.setItem("role", role);
  setToken(token);
};

export const getLocalStorage = () => {
  const token = localStorage.getItem("token");
  if (token) {
    setToken(token);
    return true;
  }
  return false;
};

export const getApiUtil = () => {
  return apiUtil;
};
