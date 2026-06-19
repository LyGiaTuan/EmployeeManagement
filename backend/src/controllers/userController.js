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
    jwtToken = await userService.validateAccessCode(body);
    res.json({ success: true, token: jwtToken });
  } catch (ex) {
    res.status(400).json({ error: ex.message });
  }
};

const createNewEmployee = async (req, res) => {
  try {
    const body = req.body;
    const employeeId = await userService.createNewEmployee(body);
    res.json({ success: true, employeeId });
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
    data = await userService.deleteEmployee(body);
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

const loginByEmployee = async (req, res) => {
  try {
    const body = req.body;
    data = await userService.loginByUsernamePassword(body);
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
};
