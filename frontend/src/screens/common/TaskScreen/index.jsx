import { useCallback, useEffect, useState } from "react";
import AppTable from "../../../components/AppTable";
import FormInput from "../../../components/FormInput";
import styles from "./styles.module.css";
import { endpoint, getApiUtil } from "../../../utils/ApiUtil";
import { toast } from "react-toastify";
import { ROLE } from "../../../utils/RoleEnum";

const TaskScreen = () => {
  const [employees, setEmployees] = useState([]);
  const [task, setTask] = useState({});
  const [tasks, setTasks] = useState([]);
  const [emailKeyword, setEmailKeyword] = useState("");
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const getEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getApiUtil().post(endpoint.MANAGER.GET_EMPLOYEES, {
        offset: offset,
        emailKeyword,
      });
      setEmployees(res.data.employees);
    } catch (ex) {
      toast.error(`Error: ${ex?.response?.data.error}`);
    } finally {
      setLoading(false);
    }
  }, [emailKeyword, offset]);

  const getTasks = async () => {
    try {
      const res = await getApiUtil().post(endpoint.TASK.GET_TASKS, {});
      setTasks(res.data);
    } catch (ex) {
      toast.error(`Error: ${ex?.response?.data.error}`);
    }
  };

  const createTask = async () => {
    try {
      const res = await getApiUtil().post(endpoint.TASK.CREATE_TASK, task);
    } catch (ex) {
      toast.error(`Error: ${ex?.response?.data.error}`);
    }
  };

  const labels = ["Email", "Name", "Button"];
  const keys = ["name", "email", "button"];
  const lists = employees?.map((employee, index) => ({
    id: index,
    email: employee.email,
    name: employee.name,
    button: (
      <div>
        <button
          className={styles.selectButton}
          onClick={() => {
            setTask({
              ...task,
              employeeEmail: employee.email,
              employeeName: employee.name,
              employeeId: employee.id,
            });
          }}
        >
          select
        </button>
      </div>
    ),
  }));

  const taskLabels = [
    "Name",
    "Employee id",
    "Employee name",
    "Employee email",
    "Start date",
    "End date",
  ];
  const taskKeys = [
    "name",
    "employeeId",
    "employeeName",
    "employeeEmail",
    "startDate",
    "endDate",
  ];
  const taskList = tasks.map((task) => ({
    id: task.id,
    name: task.name,
    employeeId: task.employeeId,
    employeeName: task.employeeName,
    employeeEmail: task.employeeEmail,
    startDate: new Date(task.endDate).toISOString().slice(0, 16),
    endDate: new Date(task.endDate).toISOString().slice(0, 16),
  }));

  useEffect(() => {
    if (user.role == ROLE.MANAGER) {
      const id = setTimeout(() => {
        getEmployees();
      });
      return () => {
        clearTimeout(id);
      };
    }
  }, [getEmployees]);

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <>
      <div className={styles.tableContainer}>
        <AppTable labels={taskLabels} keys={taskKeys} list={taskList} />
      </div>
      {user.role === ROLE.MANAGER && (
        <div className={styles.formContainer}>
          <div className={styles.form}>
            <FormInput
              value={task.name}
              label={"Task name"}
              setValue={(value) => {
                setTask({ ...task, name: value });
              }}
            />
            <FormInput
              value={
                task.employeeId
                  ? `${task.employeeName} - ${task.employeeEmail}`
                  : ""
              }
              readOnly={true}
              label={"Employee"}
            />
            <FormInput
              value={
                task.startDate &&
                new Date(task.startDate).toISOString().slice(0, 16)
              }
              type={"datetime-local"}
              label={"Start date"}
              setValue={(value) => {
                setTask({ ...task, startDate: new Date(value).valueOf() });
              }}
            />
            <FormInput
              value={
                task.endDate &&
                new Date(task.endDate).toISOString().slice(0, 16)
              }
              type={"datetime-local"}
              label={"End date"}
              setValue={(value) => {
                setTask({ ...task, endDate: new Date(value).valueOf() });
              }}
            />
            <div className={styles.createButtonContainer}>
              <button
                className={`${styles.selectButton} ${styles.createButton}`}
                onClick={createTask}
              >
                create
              </button>
            </div>
          </div>
          <div className={styles.employeeFilter}>
            <FormInput
              value={emailKeyword}
              label={"Email"}
              setValue={setEmailKeyword}
            />
            <div className={styles.employeeTableContainer}>
              <AppTable labels={labels} keys={keys} list={lists} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskScreen;
