const userService = require("../services/userService");

const createNewAccessCode = async (req, res) => {
  try {
    const body = req.body;
    const code = await userService.createNewAccessCode(body);
    res.json({ code: code });
  } catch (ex) {
    res.status(400).json({ error: ex.message });
  }
};

const validateAccessCode = async (req, res) => {
  try {
    const body = req.body;
    data = await userService.validateAccessCode(body);
    res.json(data);
  } catch (ex) {
    res.status(400).json({ error: ex.message });
  }
};

const createNewEmployee = async (req, res) => {
  try {
    const body = req.body;
    const user = req.user;
    const data = await userService.createNewEmployee(body, user);
    res.json(data);
  } catch (ex) {
    res.status(400).json({ error: ex.message });
  }
};

const getEmployees = async (req, res) => {
  try {
    const body = req.body;
    data = await userService.getEmployees(body.limit, body.offset);
    res.json(data);
  } catch (ex) {
    res.status(400).json({ error: ex.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const body = req.body;
    const user = req.user;
    data = await userService.deleteEmployee(body, user);
    res.json({ success: true });
  } catch (ex) {
    res.status(400).json({ error: ex.message });
  }
};

const setupAccount = async (req, res) => {
  try {
    const body = req.body;
    data = await userService.setupAccount(body);
    res.json(data);
  } catch (ex) {
    res.status(400).json({ error: ex.message });
  }
};

const loginByUsernamePassword = async (req, res) => {
  try {
    const body = req.body;
    data = await userService.loginByUsernamePassword(body);
    res.json(data);
  } catch (ex) {
    res.status(400).json({ error: ex.message });
  }
};

module.exports = {
  createNewAccessCode,
  validateAccessCode,
  createNewEmployee,
  getEmployees,
  deleteEmployee,
  setupAccount,
  loginByUsernamePassword,
};
