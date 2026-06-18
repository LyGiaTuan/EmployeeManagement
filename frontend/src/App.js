import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import PATH from "./Path";
import LoginScreen from "./screens/manager/LoginScreen";
import ValidateScreen from "./screens/manager/ValidateScreen";
import SideMenu from "./components/SideMenu";
import EmployeeScreen from "./screens/manager/EmployeeScreen";
import TaskScreen from "./screens/manager/TaskScreen";
import MessageScreen from "./screens/manager/MessageScreen";

function App() {
  return (
    <BrowserRouter>
      <Routes>
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
