import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import SideMenu from "./components/SideMenu";
import PATH from "./Path";
import EmployeeScreen from "./screens/manager/EmployeeScreen";
import LoginScreen from "./screens/manager/LoginScreen";
import MessageScreen from "./screens/manager/MessageScreen";
import TaskScreen from "./screens/manager/TaskScreen";
import ValidateScreen from "./screens/manager/ValidateScreen";
import AuthFilter from "./components/AuthFilter";
import SecureAccountSetupScreen from "./screens/employee/SecureAccountSetupScreen";
import EmployeeLoginScreen from "./screens/employee/EmployeeLoginScreen";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={""}
          element={
            <AuthFilter>
              <Outlet />
            </AuthFilter>
          }
        >
          <Route path={PATH.MANAGER.LOGIN} element={<LoginScreen />} />
          <Route path={PATH.MANAGER.VALIDATE} element={<ValidateScreen />} />
          <Route
            path={""}
            element={
              <SideMenu>
                <Outlet />
              </SideMenu>
            }
          >
            <Route path={PATH.MANAGER.EMPLOYEEE} element={<EmployeeScreen />} />
            <Route path={PATH.MANAGER.TASK} element={<TaskScreen />} />
            <Route path={PATH.MANAGER.MESSAGE} element={<MessageScreen />} />
          </Route>
          <Route
            path={PATH.EMPLOYEE.SECURE_ACCOUNT_SETUP}
            element={<SecureAccountSetupScreen />}
          />
          <Route path={PATH.EMPLOYEE.LOGIN} element={<EmployeeLoginScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
