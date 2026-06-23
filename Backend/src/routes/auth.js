const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const Users = require("../models/user");
const { userCustomValidator } = require("../utils/userValidators");

// ! Creating the user
authRouter.post("/signUp", async (req, res) => {
  try {
    userCustomValidator(req);
    const { firstName, lastName, emailId, password } = req.body;
    const passHash = await bcrypt.hash(password, 10);
    const user = new Users({
      firstName,
      lastName,
      emailId,
      password: passHash,
    });
    await user.save();
    res.send("the user created successfully");
  } catch (err) {
    res.status(400).send(`${err}`);
  }
});

// ! Login api
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await Users.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("The user is not valid");
    }
    const isPasswordValid = await user.ValidatedPass(password);

    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("jwtToken", token);

      res.send("The User Login Successfully");
    } else {
      res.send("Enter the correct password or email");
    }
  } catch (error) {
    res.status(400).send("Error while login" + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res
    .cookie("jwtToken", null, { expires: new Date(Date.now()) })
    .send("Logout Success");
});

module.exports = authRouter;
