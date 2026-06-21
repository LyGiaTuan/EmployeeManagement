const db = require("../config/firebaseConfig");
const ROLE = require("../enums/role");
const crypto = require("crypto");

const createTask = async (task) => {
  task.id = crypto.randomUUID();
  await db.runTransaction(async (tx) => {
    tx.set(db.collection("tasks").doc(task.id), task);
  });
  return { success: true, task };
};

const getTasks = async (user) => {
  let tasks = [];
  await db.runTransaction(async (tx) => {
    let tasksRef = db.collection("tasks").orderBy("startDate", "asc");
    if (user.role == ROLE.EMPLOYEE) {
      tasksRef = tasksRef.where("employeeId", "==", user.id);
    }
    const tasksSnapshot = await tx.get(tasksRef);
    tasksSnapshot.forEach((taskSnapshot) => {
      tasks.push(taskSnapshot.data());
    });
  });
  return tasks;
};

module.exports = { createTask, getTasks };
