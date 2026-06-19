import { useEffect } from "react";
import { getLocalStorage } from "../../utils/ApiUtil";

const AuthFilter = ({ children }) => {
  getLocalStorage();
  return children;
};

export default AuthFilter;
