const nodemailer = require("nodemailer");

const sendMail = (email, from, subject, message) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const emailOptions = {
    from: from,
    to: email,
    subject: subject,
    text: message,
  };

  transporter.sendMail(emailOptions, (error, info) => {
    if (error) {
      console.error("Error occurred:", error);
    } else {
      console.log("Email sent:", info.response);
      res.send("Email sent successfully!");
    }
  });
};

module.exports = { sendMail };
