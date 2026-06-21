import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import SideMenu from "./components/SideMenu";
import PATH from "./Path";
import ChatGroupsProvider from "./providers/ChatGroupsProvider";
import SocketProvider from "./providers/SocketProvider";
import EditProfileScreen from "./screens/common/EditProfileScreen";
import MessageScreen from "./screens/common/MessageScreen";
import EmployeeLoginScreen from "./screens/employee/EmployeeLoginScreen";
import SecureAccountSetupScreen from "./screens/employee/SecureAccountSetupScreen";
import EmployeeScreen from "./screens/manager/EmployeeScreen";
import LoginScreen from "./screens/manager/LoginScreen";
import ValidateScreen from "./screens/manager/ValidateScreen";
import { loadToken } from "./utils/ApiUtil";
import TaskScreen from "./screens/common/TaskScreen";

function App() {
  loadToken();

  return (
    <SocketProvider>
      <ChatGroupsProvider>
        <BrowserRouter>
          <Routes>
            <Route path={PATH.MANAGER.LOGIN} element={<LoginScreen />} />
            <Route path={PATH.MANAGER.VALIDATE} element={<ValidateScreen />} />
            <Route
              path={PATH.EMPLOYEE.SECURE_ACCOUNT_SETUP}
              element={<SecureAccountSetupScreen />}
            />
            <Route
              path={""}
              element={
                <SideMenu>
                  <Outlet />
                </SideMenu>
              }
            >
              <Route
                path={PATH.MANAGER.EMPLOYEEE}
                element={<EmployeeScreen />}
              />
              <Route path={PATH.COMMON.MESSAGE} element={<MessageScreen />} />
              <Route
                path={PATH.COMMON.EDIT_PROFILE}
                element={<EditProfileScreen />}
              />
              <Route path={PATH.COMMON.TASK} element={<TaskScreen />} />
            </Route>
            <Route
              path={PATH.EMPLOYEE.LOGIN}
              element={<EmployeeLoginScreen />}
            />
          </Routes>
        </BrowserRouter>
      </ChatGroupsProvider>
    </SocketProvider>
  );
}

export default App;
