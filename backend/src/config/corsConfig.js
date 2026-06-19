const cors = require("cors");

const configureApp = (app) => {
  app.use(cors({ origin: process.env.FE_URL, optionsSuccessStatus: 200 }));
};

module.exports = { configureApp };
