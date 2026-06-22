const twilio = require("twilio");

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

const sendSMS = async (phoneNumber) => {
  const msg = await twilioClient.verify.v2
    .services(process.env.TWILIO_VERIFY_SERVICE_SID)
    .verifications.create({
      to: phoneNumber,
      channel: "sms",
    });
};

const validateSMS = async (phoneNumber, code) => {
  return await twilioClient.verify.v2
    .services(process.env.TWILIO_VERIFY_SERVICE_SID)
    .verificationChecks.create({
      to: phoneNumber,
      code,
    });
};

module.exports = { sendSMS, validateSMS };
