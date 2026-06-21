import styles from "./styles.module.css";
import magnifyingGlassIcon from "../../../assets/magnifyingGlassIcon.svg";
import CreateEmployeeForm from "./CreateEmployeeForm";
import { useCallback, useEffect, useRef, useState } from "react";
import { endpoint, getApiUtil } from "../../../utils/ApiUtil";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";
import AppTable from "../../../components/AppTable";

const ACTION = {
  DELETE: "DELETE",
  EDIT: "EDIT",
};

export const SHOW_TYPE = {
  EDIT: "EDIT",
  CREATE: "CREATE",
};

const EmployeeScreen = () => {
  const [employees, setEmployees] = useState([]);
  const [employee, setEmployee] = useState();
  const employeesCount = useRef(0);
  const [loading, setLoading] = useState(true);
  const [emailKeyword, setEmailKeyword] = useState("");
  const [rowLoading, setRowLoading] = useState({});
  const [offset, setOffset] = useState(0);
  const getEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getApiUtil().post(endpoint.MANAGER.GET_EMPLOYEES, {
        offset: offset,
        emailKeyword,
      });
      employeesCount.current = res.data.employeesCount;
      setEmployees(res.data.employees);
    } catch (ex) {
      toast.error(`Error: ${ex?.response?.data.error}`);
    } finally {
      setLoading(false);
    }
  }, [emailKeyword, offset]);

  const deleteEmployee = async (currentEmployee) => {
    try {
      setRowLoading({ employeeId: currentEmployee.id, action: ACTION.DELETE });
      await getApiUtil().post(endpoint.MANAGER.DELETE_EMPLOYEE, {
        employeeId: currentEmployee.id,
      });
      setEmployees(
        employees.filter((employee) => employee.id !== currentEmployee.id),
      );
      employeesCount.current = employeesCount.current - 1;
      toast("Delete success");
    } catch (err) {
      toast.error(`Error: ${err?.response?.data.error}`);
    } finally {
      setRowLoading({});
    }
  };

  const editEmployee = (currentEmployee) => {
    setEmployee({
      ...currentEmployee,
      phoneNumber: currentEmployee.phoneNumber.slice(3),
    });
  };

  const buttons = [
    {
      buttonStyle: styles.editButton,
      buttonDisabledStyle: styles.disabledEditButton,
      handleClick: editEmployee,
      title: "Edit",
      action: ACTION.EDIT,
    },
    {
      buttonStyle: styles.deleteButton,
      buttonDisabledStyle: styles.disabledDeleteButton,
      handleClick: deleteEmployee,
      title: "Delete",
      action: ACTION.DELETE,
    },
  ];

  useEffect(() => {
    const callApiId = setTimeout(() => {
      getEmployees();
    }, 400);

    return () => {
      clearTimeout(callApiId);
    };
  }, [getEmployees]);

  useEffect(() => {
    setLoading(true);
  }, [offset]);

  const labels = ["Employee Name", "Email", "Phone Number", "Action"];
  const keys = ["name", "email", "active", "buttons"];
  const lists = employees.map((employee) => ({
    id: employee.id,
    name: employee.name,
    email: employee.email,
    active: (
      <div
        className={`${styles.status} ${employee.active ? styles.active : styles.inactive}`}
      >
        {employee.active ? "Active" : "Inactive"}
      </div>
    ),
    buttons: (
      <div className={styles.buttons}>
        {buttons.map((item, index) => {
          return (
            <button
              key={index}
              className={`${styles.baseButton} ${employee.id === rowLoading.employeeId ? item.buttonDisabledStyle : item.buttonStyle}`}
              disabled={employee.id === rowLoading.employeeId}
              onClick={() => {
                item.handleClick(employee);
              }}
            >
              {rowLoading.action === item.action &&
              employee.id === rowLoading.employeeId ? (
                <Oval width={20} height={20} color="black" />
              ) : (
                item.title
              )}
            </button>
          );
        })}
      </div>
    ),
  }));

  return (
    <>
      <div className={styles.employeeTableContainer}>
        <div className={styles.labelContainer}>
          <div className={styles.label}>Manage Employee</div>
        </div>
        <div className={styles.infoContainer}>
          <div className={styles.employeeCount}>
            {employeesCount.current} Employee
          </div>
          <div className={styles.toolsContainer}>
            <button
              className={styles.createEmployeeButton}
              onClick={() => {
                setEmployee({});
              }}
            >
              + Create Employee
            </button>
            <div className={styles.searchBar}>
              <img
                className={styles.magnifyingGlassIcon}
                src={magnifyingGlassIcon}
                alt={"magnifyingGlassIcon"}
              />
              <input
                className={styles.searchInput}
                onChange={(e) => {
                  setEmailKeyword(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
        {loading ? (
          <div className={styles.loadingContainer}>
            <Oval width={30} height={30} color="black" />
          </div>
        ) : (
          <>
            <AppTable labels={labels} keys={keys} list={lists} />
            <div className={styles.navigationButtonsContainer}>
              <button
                className={`${styles.baseButton} ${styles.navigationButton}`}
                disabled={!offset}
                onClick={() => {
                  setOffset(offset - 10);
                }}
              >
                &larr;
              </button>
              <button
                className={`${styles.baseButton} ${styles.navigationButton}`}
                disabled={!employees.length}
                onClick={() => {
                  setOffset(offset + 10);
                }}
              >
                &rarr;
              </button>
            </div>
          </>
        )}
      </div>
      <CreateEmployeeForm employee={employee} setEmployee={setEmployee} />
    </>
  );
};

export default EmployeeScreen;
