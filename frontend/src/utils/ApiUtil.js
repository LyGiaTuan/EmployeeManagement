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

export const setToken = (token) => {
  localStorage.setItem("token", token);
  apiUtil = axios.create({
    baseURL: baseUrl,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const loadToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    setToken(token);
  }
};

export const clearToken = () => {
  localStorage.removeItem("token");
  apiUtil = axios.create({
    baseURL: baseUrl,
  });
};

export const getApiUtil = () => {
  return apiUtil;
};
