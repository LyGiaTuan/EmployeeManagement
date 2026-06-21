const db = require("./config/firebaseConfig");
const crypto = require("crypto");
const ROLE = require("./enums/role");
const passwordUtil = require("./utils/passwordUtil");
const validateUtil = require("./utils/validateUtil");

const initManager = async () => {
  const hashedPassword = await passwordUtil.hashPassword(
    process.env.MANAGER_PASSWORD,
  );
  validateUtil.validateUsername(process.env.MANAGER_USERNAME);
  validateUtil.validateEmail(process.env.MANAGER_EMAIL);
  await db.runTransaction(async (tx) => {
    const phoneNumber = process.env.MANAGER_PHONE;
    const email = process.env.MANAGER_EMAIL;
    const name = process.env.MANAGER_NAME;
    const role = ROLE.MANAGER;
    const address = process.env.MANAGER_ADDRESS;
    const username = process.env.MANAGER_USERNAME;
    const password = hashedPassword;
    tx.set(db.collection("users").doc(phoneNumber), {
      id: crypto.randomUUID(),
      phoneNumber: phoneNumber,
      email: email,
      name: name,
      role: role,
      address: address,
      active: true,
      username: username,
      password: hashedPassword,
    });
  });
};

initManager()