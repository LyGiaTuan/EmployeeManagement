require("dotenv").config();
const express = require("express");
const app = express();
const userRouter = require("./routers/userRouter");
const bodyConfig = require("./config/bodyConfig");
const corsConfig = require("./config/corsConfig");
const socketConfig = require("./config/socketConfig")

bodyConfig.configureApp(app);
corsConfig.configureApp(app);
const server = socketConfig.configureApp(app)

app.use("/user", userRouter);


server.listen(5000, () => {
  console.log("service start at http://localhost:5000");
});
