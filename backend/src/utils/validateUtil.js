const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^[a-zA-Z0-9]+$/;

const validateEmail = (email) => {
  if (!emailRegex.test(email)) {
    throw new Error("Email is invalid");
  }
};

const validateUsername = (username) => {
  if (!usernameRegex.test(username)) {
    throw new Error(
      "Username cannot include upper letter, lower letter, space",
    );
  }
};

const checkEmpty = (key, value) => {
  if (value == null || value.length === 0) {
    throw new Error(`${key} is required`);
  }
};

module.exports = { validateEmail, validateUsername, checkEmpty };
