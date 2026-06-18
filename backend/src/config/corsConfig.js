const cors = require("cors");

const configureApp = (app) => {
  app.use(cors());
};

module.exports = { configureApp };
