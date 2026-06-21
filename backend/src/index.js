require("dotenv").config();
const express = require("express");
const app = express();
const userRouter = require("./routers/userRouter");
const taskRouter = require("./routers/taskRouter")
const bodyConfig = require("./config/bodyConfig");
const corsConfig = require("./config/corsConfig");
const socketConfig = require("./config/socketConfig");
const initData = require("./config/initData");

bodyConfig.configureApp(app);
corsConfig.configureApp(app);
const server = socketConfig.configureApp(app);

app.use("/user", userRouter);
app.use("/task", taskRouter)


initData.initManager();

server.listen(5000, () => {
  console.log("service start at http://localhost:5000");
});
