const smsClient = require("../config/smsConfig");

const sendSMS = async (receivedPhoneNumber, message) => {
  try {
    await smsClient.sendSMS(receivedPhoneNumber, message);
  } catch (error) {
    console.error("❌ Lỗi khi gửi SMS:", error.message, error.code);
  }
};

module.exports = { sendSMS };
