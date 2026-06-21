const express = require("express");
const connectDb = require("./config/database");
const Users = require("./models/user");
const app = express();
const port = 3000;

app.post("/signUp", async (req, res) => {
  // Createing a new instance of the user model
  const user = new Users({
    firstName: "Dhurv",
    lastName: "Akbari",
    emailId: "ad.dhruvakbari@gmail.com",
    password: "1234",
  });

  try {
    await user.save();
    res.send("User Added Successfully");
  } catch (err) {
    res.status(400).send("Error on saving the user data");
  }
});

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
