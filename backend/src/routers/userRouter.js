const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userController");

userRouter.post("/create-new-access-code", userController.createNewAccessCode);
userRouter.post("/validate-access-code", userController.validateAccessCode);

module.exports = userRouter;
