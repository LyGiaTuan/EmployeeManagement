const smsService = require("./smsService");
const db = require("../config/firebaseConfig");
const jwt = require("jsonwebtoken");

const createNewAccessCode = async (body) => {
  const phoneNumber = `+84${body.phoneNumber}`;
  const code = Math.round(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");

  await db.runTransaction(async (tx) => {
    const managersSnapshot = await tx.get(
      db.collection("users").doc(phoneNumber),
    );

    if (managersSnapshot.empty) {
      throw new Error("Manager not found");
    }

    tx.set(db.collection("otps").doc(phoneNumber), {
      code: code,
    });
  });
  // smsService.sendSMS(phoneNumber, otp);
  return code;
};

const validateAccessCode = async (body) => {
  const code = body.code;
  const phoneNumber = `+84${body.phoneNumber}`;
  let jwtToken = "";
  await db.runTransaction(async (tx) => {
    const otpRef = db.collection("otps").doc(phoneNumber);
    const otpSnapshot = await tx.get(otpRef);
    if (!otpSnapshot.exists) {
      throw new Error("Code doesn't exist");
    }

    const otp = otpSnapshot.data();

    if (!otp.code) {
      throw new Error("Code doesn't exist");
    }
    
    if (otp.code != code) {
      throw new Error("Code doesn't match");
    }

    const managerSnapshot = await tx.get(
      db.collection("users").doc(phoneNumber),
    );
    const manager = managerSnapshot.data();

    tx.set(db.collection("otps").doc(phoneNumber), { code: "" });

    jwtToken = jwt.sign(manager, process.env.JWT_SECRET);
  });
  return jwtToken;
};

module.exports = { createNewAccessCode, validateAccessCode };
