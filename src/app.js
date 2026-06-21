const express = require("express");
const app = express();
const port = 3000;
const { adminAuth } = require("./middleware/auth");

app.use("/admin", adminAuth);

app.get("/admin/data", (req, res) => {
  res.send("Admin data page");
});

app.get("/admin/deletdata", (req, res) => {
  res.send("Admin Delete Data");
});

app.listen(port, () => {
  console.log(`Server Started on ${port}`);
});
