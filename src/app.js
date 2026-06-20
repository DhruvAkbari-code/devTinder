const express = require("express");
const app = express();
const port = 3000;

app.use("/test", (req, res) => {
  res.send("Hello from the server. Dhruv this side");
});

app.listen(port, () => {
  console.log("Server Started on 3000");
});
