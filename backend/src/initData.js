require("dotenv").config();
const db = require("./config/firebaseConfig");

const initManager = async () => {
  await db.runTransaction(async (tx) => {
    const phoneNumber = process.env.MANAGER_PHONE;
    const email = process.env.MANAGER_EMAIL;
    const name = process.env.MANAGER_NAME;
    const role = "MANAGER";
    tx.set(db.collection("users").doc(phoneNumber), {
      phoneNumber: phoneNumber,
      email: email,
      name: name,
      role: role,
    });
  });
};

initManager();
