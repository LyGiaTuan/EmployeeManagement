const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userController");
const authFilter = require("../filters/authFilter");

userRouter.post(
  "/manager/create-new-access-code",
  userController.createNewAccessCode,
);
userRouter.post(
  "/manager/validate-access-code",
  userController.validateAccessCode,
);
userRouter.post(
  "/manager/employee",
  authFilter.managerFilter,
  userController.createNewEmployee,
);

userRouter.post(
  "/manager/employee/get-list",
  authFilter.managerFilter,
  userController.getEmployees,
);

userRouter.post(
  "/manager/employee/delete",
  authFilter.managerFilter,
  userController.deleteEmployee,
);

userRouter.post("/employee/setup-account", userController.setupAccount);
userRouter.post("/employee/login",userController.loginByEmployee)

module.exports = userRouter;
