const smsClient = require("../config/smsConfig");

const sendSMS = async (receivedPhoneNumber) => {
  try {
    const res = await smsClient.sendSMS(receivedPhoneNumber);
  } catch (error) {
    console.error("❌ Lỗi khi gửi SMS:", error.message, error.code);
  }
};

const validateSMSCode = async (receivedPhoneNumber, code) => {
  const res = await smsClient.validateSMS(receivedPhoneNumber, code);
  if (!res.valid) {
    throw new Error("Code doesn't match");
  }
};

module.exports = { sendSMS, validateSMSCode };
