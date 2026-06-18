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

module.exports = { createNewAccessCode, validateAccessCode };
