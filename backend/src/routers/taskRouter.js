const express = require("express");
const taskRouter = express.Router();
const taskController = require("../controllers/taskController");
const authFilter = require("../filters/authFilter");

taskRouter.post("/", authFilter.managerFilter, taskController.createTask);
taskRouter.post(
  "/get",
  authFilter.authenticatedFilter,
  taskController.getTasks,
);

module.exports = taskRouter;
