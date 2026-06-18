const express = require("express")
const configureApp = (app) => {
  app.use(express.json());
};

module.exports = { configureApp };
