const express = require("express");
const connectDb = require("./config/database");
const Users = require("./models/user");
const app = express();
const port = 3000;

app.use(express.json());

app.post("/signUp", async (req, res) => {
  const user = new Users(req.body);
  try {
    await user.save();
    res.send("the user created successfully");
  } catch (err) {
    res.status(400).send(`{err}`);
  }
});

//! find all the user from the database
app.get("/findAllUsers", async (req, res) => {
  const firstName = req.body.firstName;
  try {
    const user = await Users.find({ firstName: firstName });
    user.length !== 0 ? res.send(user) : res.send("User not found");
  } catch (error) {
    res.status(400).send("Some went wrong");
  }
});

//! get all the users from the database
app.get("/getAllUsers", async (req, res) => {
  try {
    const users = await Users.find({});
    users.length !== 0 ? res.send(users) : res.send("no Users");
  } catch (error) {
    res.status(400).send("Some went wrong");
  }
});

// !Delete the user
app.delete("/deleteUser", async (req, res) => {
  const firstName = req.body.firstName;
  try {
    const user = await Users.findOneAndDelete({ firstName: firstName });
    user.length !== 0 ? res.send(user) : res.send("User Deleted Success");
  } catch (error) {
    res.status(400).send("Some went wrong");
  }
});

// !update the user
app.patch("/updateUser", async (req, res) => {
  const firstName = req.body.firstName;
  const updatedData = req.body;
  try {
    const user = await Users.findOneAndUpdate(
      { firstName: firstName },
      updatedData,
      { returnDocument: "after" },
    );
    user.length !== 0 ? res.send(user) : res.send("User Deleted Success");
  } catch (error) {
    res.status(400).send("Some went wrong");
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
