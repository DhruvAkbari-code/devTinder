const express = require("express");
const connectDb = require("./config/database");
const cookieParser = require("cookie-parser");

const app = express();
const port = 3000;

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestsRouter = require("./routes/requests");
const userRouter = require("./routes/users");

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);
app.use("/", userRouter);

connectDb()
  .then(() => {
    console.log("Conneted");
    app.listen(port, () => {
      console.log(`Server Started on ${port}`);
    });
  })
  .catch(() => {
    console.log("Error occured");
  });
