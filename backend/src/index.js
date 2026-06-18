const express = require("express");
require("dotenv").config();
const app = express();
const userRouter = require("./routers/userRouter");
const bodyConfig = require("./config/bodyConfig");
const corsConfig = require("./config/corsConfig");

bodyConfig.configureApp(app);
corsConfig.configureApp(app);

app.use("/user", userRouter);

app.listen(5000, () => {
  console.log("service start at http://localhost:5000");
});
