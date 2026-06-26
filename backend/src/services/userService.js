const smsService = require("./smsService");
const db = require("../config/firebaseConfig");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");
const ROLE = require("../enums/role");
const crypto = require("crypto");
const emailService = require("./emailService");
const passwordUtil = require("../utils/passwordUtil");
const validateUtil = require("../utils/validateUtil");
const securityUtil = require("../utils/securityUtil");
const { getIo, userMap } = require("../config/socketConfig");

const createNewAccessCode = async (body) => {
  let phoneNumber = body.phoneNumber;
  validateUtil.checkEmpty("Phone number", phoneNumber);
  phoneNumber = `+84${phoneNumber}`;

  await db.runTransaction(async (tx) => {
    const managerSnapshot = await tx.get(
      db.collection("users").doc(phoneNumber),
    );

    if (!managerSnapshot.exists) {
      throw new Error("Manager not found");
    }
  });

  await smsService.sendSMS(phoneNumber);
  return { success: true };
};

const validateAccessCode = async (body) => {
  const code = body.code;
  let phoneNumber = body.phoneNumber;
  validateUtil.checkEmpty("Phone number", phoneNumber);
  validateUtil.checkEmpty("Code", code);

  phoneNumber = `+84${body.phoneNumber}`;
  let manager;
  let token = "";
  await smsService.validateSMSCode(phoneNumber, code);
  await db.runTransaction(async (tx) => {
    const managerSnapshot = await tx.get(
      db.collection("users").doc(phoneNumber),
    );

    manager = managerSnapshot.data();
    token = securityUtil.generateToken(
      manager.id,
      manager.email,
      manager.phoneNumber,
      manager.role,
      manager.name,
    );
  });

  delete manager.password;
  delete manager.activateKey;

  return {
    success: true,
    token: token,
    ...manager,
  };
};

const createNewEmployee = async (employee, manager) => {
  validateUtil.validateEmail(employee.email);
  validateUtil.checkEmpty("Name", employee.name);
  validateUtil.checkEmpty("Phone number", employee.phoneNumber);
  validateUtil.checkEmpty("Address", employee.address);

  employee.phoneNumber = `+84${employee.phoneNumber}`;
  let chatGroup;
  await db.runTransaction(async (tx) => {
    const foundPhoneNumberUserQuery = db
      .collection("users")
      .where("phoneNumber", "==", employee.phoneNumber)
      .limit(1);

    const foundEmailUserQuery = db
      .collection("users")
      .where("email", "==", employee.email)
      .limit(1);

    const phoneNumberUserSnapshot = await tx.get(foundPhoneNumberUserQuery);
    if (!phoneNumberUserSnapshot.empty) {
      throw new Error("Phone number is already registered");
    }

    const emailUserSnapshot = await tx.get(foundEmailUserQuery);
    if (!emailUserSnapshot.empty) {
      throw new Error("Email is already registered");
    }

    const usersCountSnapshot = await tx.get(
      db.collection("employeesCount").doc("primary"),
    );

    const usersCount = usersCountSnapshot.exists
      ? usersCountSnapshot.data()
      : { value: 0 };

    employee = {
      name: employee.name.trim(),
      email: employee.email,
      phoneNumber: employee.phoneNumber.trim(),
      address: employee.address.trim(),
      id: crypto.randomUUID(),
      role: ROLE.EMPLOYEE,
      activateKey: crypto.randomUUID(),
      active: false,
    };

    tx.set(db.collection("users").doc(employee.phoneNumber), employee);

    tx.set(db.collection("employeesCount").doc("primary"), {
      value: parseInt(usersCount.value) + 1,
    });

    chatGroup = {
      employeeId: employee.id,
      lastMessage: "",
      workTime: new Date().valueOf(),
      isEmployeeSender: false,
      employeeName: employee.name,
      managerName: manager.name,
      managerId: manager.id,
    };

    tx.set(db.collection("chatGroups").doc(employee.id), chatGroup);
  });

  getIo().to(userMap.get(manager.id)).emit("server_send_group", chatGroup);

  emailService.sendMail(
    employee.email,
    "Employee Management",
    "Your account has been created",
    `Your account email is ${employee.email}, click this link to complete registeration: ${process.env.FE_URL}/employee/secure-account-setup?activateKey=${employee.activateKey}`,
  );

  return { success: true, employeeId: employee.id };
};

const getEmployees = async (offset = 0, emailKeyword) => {
  let employees = [];
  let employeesCount = 0;
  await db.runTransaction(async (tx) => {
    let employeesQuery = db
      .collection("users")
      .where("role", "==", ROLE.EMPLOYEE);

    if (emailKeyword) {
      employeesQuery = employeesQuery.where("email", "==", emailKeyword);
    }

    employeesQuery = employeesQuery
      .select("id", "email", "name", "phoneNumber", "address", "active")
      .limit(10)
      .offset(offset);

    const employeesSnapshot = await tx.get(employeesQuery);
    employeesSnapshot.forEach(
      (employeeSnapshot) =>
        (employees = [employeeSnapshot.data(), ...employees]),
    );

    const employeesCountSnapshot = await tx.get(
      db.collection("employeesCount").doc("primary"),
    );

    employeesCount = employeesCountSnapshot.data() || { value: 0 };
  });
  return { employees, employeesCount: employeesCount.value };
};

const deleteEmployee = async (body, user) => {
  const employeeId = body.employeeId;
  validateUtil.checkEmpty("Employee id", employeeId);
  await db.runTransaction(async (tx) => {
    const employeesQuery = db
      .collection("users")
      .where("id", "==", employeeId)
      .limit(1);

    const employeesSnapshot = await tx.get(employeesQuery);

    const usersCountSnapshot = await tx.get(
      db.collection("employeesCount").doc("primary"),
    );
    const usersCount = usersCountSnapshot.data();

    let employee;
    employeesSnapshot.forEach((employeeSnapshot) => {
      employee = employeeSnapshot.data();
    });

    const messagesSnapshot = await tx.get(
      db.collection("messages").where("employeeId", "==", employee.id),
    );

    tx.delete(db.collection("chatGroups").doc(employee.id));
    tx.delete(db.collection("users").doc(employee.phoneNumber));
    messagesSnapshot.forEach((messageSnapshot) => {
      tx.delete(messageSnapshot.ref);
    });

    tx.set(db.collection("employeesCount").doc("primary"), {
      value: parseInt(usersCount.value) - 1,
    });
  });

  getIo().to(userMap.get(user.id)).emit("server_delete_group", employeeId);
};

const setupAccount = async (body) => {
  const activateKey = body.activateKey;
  const username = body.username;
  const password = body.password;

  validateUtil.validateUsername(username);
  const hashedPassword = await passwordUtil.hashPassword(password);
  let employee;

  await db.runTransaction(async (tx) => {
    const employeesQuery = db
      .collection("users")
      .where("activateKey", "==", activateKey)
      .limit(1);

    const employeesSnapshot = await tx.get(employeesQuery);

    if (employeesSnapshot.empty) {
      throw new Error("Account doesn't exist");
    }

    employeesSnapshot.forEach((employeeSnapshot) => {
      employee = employeeSnapshot.data();
    });

    if (employee.active) {
      throw new Error("Account is already active");
    }

    if (activateKey !== employee.activateKey) {
      throw new Error("Activate key isn't match");
    }

    const foundEmployeesQuery = db
      .collection("users")
      .where("username", "==", username)
      .limit(1);

    const foundEmployeesSnapshot = await tx.get(foundEmployeesQuery);

    if (!foundEmployeesSnapshot.empty) {
      throw new Error("Username is already registered");
    }

    employee.username = username;
    employee.password = hashedPassword;
    employee.active = true;

    tx.set(db.collection("users").doc(employee.phoneNumber), employee);
  });

  return { employeeId: employee.id, success: true };
};

const loginByUsernamePassword = async (body) => {
  const username = body.username;
  const password = body.password;
  validateUtil.checkEmpty("Username", username);
  validateUtil.checkEmpty("Password", password);
  let token = "";
  let user;

  await db.runTransaction(async (tx) => {
    const usersQuery = db
      .collection("users")
      .where("username", "==", username)
      .limit(1);

    const usersSnapshot = await tx.get(usersQuery);

    if (usersSnapshot.empty) {
      throw new Error("Username or Password is wrong");
    }

    usersSnapshot.forEach((userSnapshot) => {
      user = userSnapshot.data();
    });

    const result = await passwordUtil.comparePassword(password, user.password);
    if (!result) {
      throw new Error("Username or Password is wrong");
    }

    token = securityUtil.generateToken(
      user.id,
      user.email,
      user.phoneNumber,
      user.role,
      user.name,
    );
  });

  delete user.password;
  delete user.activateKey;

  return {
    success: true,
    token: token,
    ...user,
  };
};

const updateEmployee = async (employee) => {
  if (employee.email) {
    validateUtil.validateEmail(employee.email);
  }
  validateUtil.checkEmpty("Phone number", employee.phoneNumber);
  employee.phoneNumber = `+84${employee.phoneNumber}`;
  let foundEmployee;

  await db.runTransaction(async (tx) => {
    const employeeRef = await db.collection("users").doc(employee.phoneNumber);
    const employeeSnapshot = await tx.get(employeeRef);

    if (!employeeSnapshot.exists) {
      throw new Error("User is not found");
    }

    foundEmployee = employeeSnapshot.data();
    if (employee.email) {
      foundEmployee.email = employee.email;
    }
    if (employee.address) {
      foundEmployee.address = employee.address;
    }
    if (employee.name) {
      foundEmployee.name = employee.name;
      tx.update(db.collection("users").doc(employee.id), {
        employeeName: foundEmployee.name,
      });
    }

    tx.set(
      db.collection("users").doc(foundEmployee.phoneNumber),
      foundEmployee,
    );
  });

  return { success: true, employee: foundEmployee };
};

const updateProfile = async (user, userData) => {
  if (userData.email) {
    validateUtil.validateEmail(userData.email);
  }

  let hashedPassword;
  if (userData.password) {
    hashedPassword = await passwordUtil.hashPassword(userData.password);
  }

  let foundUser;

  await db.runTransaction(async (tx) => {
    const userRef = await db.collection("users").doc(user.phoneNumber);
    const userSnapshot = await tx.get(userRef);

    if (!userSnapshot.exists) {
      throw new Error("User is not found");
    }

    foundUser = userSnapshot.data();
    if (userData.email) {
      const foundUsersRef = await db
        .collection("users")
        .where("email", "==", userData.email);
      const foundUsersSnapshot = await tx.get(foundUsersRef);

      if (!foundUsersSnapshot.empty) {
        throw new Error("Email is already registered");
      }

      foundUser.email = userData.email;
    }
    if (userData.address) {
      foundUser.address = userData.address;
    }
    if (userData.name) {
      foundUser.name = userData.name;
    }
    if (hashedPassword) {
      foundUser.password = hashedPassword;
    }

    if (userData.phoneNumber) {
      const foundUserRef = await db
        .collection("users")
        .doc(`+84${userData.phoneNumber}`);
      const foundUserSnapshot = await tx.get(foundUserRef);
      if (foundUserSnapshot.exists) {
        throw new Error("Phone number is already registered");
      }
      tx.delete(userRef);
      foundUser.phoneNumber = `+84${userData.phoneNumber}`;
    }
    tx.set(db.collection("users").doc(foundUser.phoneNumber), foundUser);
  });

  delete foundUser.password;

  return { success: true, user: foundUser };
};

module.exports = {
  createNewAccessCode,
  validateAccessCode,
  createNewEmployee,
  getEmployees,
  deleteEmployee,
  setupAccount,
  loginByUsernamePassword,
  updateEmployee,
  updateProfile,
};
