const jwt = require("jsonwebtoken");

const generateToken = (email, phoneNumber, role) => {
  return jwt.sign({ email, phoneNumber, role }, process.env.JWT_SECRET);
};

const verifyToken = (token) => {
  jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
