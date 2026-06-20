const bcrypt = require("bcrypt");

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?!.*\s).{8,16}$/;

const checkPassword = (rawPassword) => {
  if (!passwordRegex.test(rawPassword)) {
    throw new Error(
      `Password is not strong enough, includes: at least 1 lower letter, at least 1 upper letter, at least 1 specical char, at least 1 number, at least 8 characters long, no space`,
    );
  }
};

const hashPassword = async (rawPassword) => {
  checkPassword(rawPassword);
  return await bcrypt.hash(rawPassword, parseInt(process.env.PASSWORD_SALT));
};

const comparePassword = async (rawPassword, hashedPassword) => {
  return await bcrypt.compare(rawPassword, hashedPassword);
};

module.exports = { hashPassword, comparePassword };
