const taskService = require("../services/taskService");

const createTask = async (req, res) => {
  try {
    const task = req.body;
    const data = await taskService.createTask(task);
    res.json(data);
  } catch (ex) {
    res.status(400).json({ error: ex.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const user = req.user;
    const data = await taskService.getTasks(user);
    res.json(data);
  } catch (ex) {
    console.log(ex);
    res.status(400).json({ error: ex.message });
  }
};

module.exports = { createTask, getTasks };
