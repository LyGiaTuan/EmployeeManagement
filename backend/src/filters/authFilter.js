const jwt = require("jsonwebtoken");
const ROLE = require("../enums/role");
const securityUtil = require("../utils/securityUtil");

const managerFilter = (req, res, next) => {
  const authorization = req.headers.authorization;
  const token = authorization?.split(" ")?.[1];

  if (!token) {
    res.status(401).json({ error: "token is required" });
    return;
  }

  let tokenData;
  try {
    tokenData = securityUtil.verifyToken(token);
  } catch (ex) {
    res.status(401).json({ error: ex.message });
    return;
  }

  if (tokenData.role != ROLE.MANAGER) {
    res.status(403).json({ error: "Permission denied" });
    return;
  }

  req.user = tokenData;

  next();
};

module.exports = { managerFilter };
