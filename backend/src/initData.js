require("dotenv").config();
const db = require("./config/firebaseConfig");
const crypto = require("crypto");
const ROLE = require("./enums/role");

const initManager = async () => {
  await db.runTransaction(async (tx) => {
    const phoneNumber = process.env.MANAGER_PHONE;
    const email = process.env.MANAGER_EMAIL;
    const name = process.env.MANAGER_NAME;
    const role = ROLE.MANAGER;
    const address = process.env.MANAGER_ADDRESS;
    tx.set(db.collection("users").doc(phoneNumber), {
      id: crypto.randomUUID(),
      phoneNumber: phoneNumber,
      email: email,
      name: name,
      role: role,
      address: address,
      active: true,
    });
  });
};

initManager();
