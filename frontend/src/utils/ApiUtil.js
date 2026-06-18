import axios from "axios";

export const endpoint = {
  MANAGER: {
    CREATE_NEW_ACCESS_CODE: "/user/create-new-access-code",
    VALIDATE_ACCESS_CODE: "/user/validate-access-code",
  },
};

const baseUrl = "http://localhost:5000/";
let apiUtil = axios.create({
  baseURL: baseUrl,
});

export const setToken = (token) => {
  apiUtil = axios.create({
    baseURL: baseUrl,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getApiUtil = () => {
  return apiUtil;
};
