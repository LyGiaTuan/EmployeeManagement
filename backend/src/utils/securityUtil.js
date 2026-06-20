const jwt = require("jsonwebtoken");

const generateToken = (id, email, phoneNumber, role, name) => {
  return jwt.sign(
    { id, email, phoneNumber, role, name },
    process.env.JWT_SECRET,
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
