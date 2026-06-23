const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const {
  validateEditProfile,
  passwordValidator,
} = require("../utils/userValidators");
const bcrypt = require("bcrypt");
const validator = require("validator");

// ! Profile api after the login
profileRouter.get("/profile/view", userAuth, (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      res.send("User not found");
    }

    res.send(user);
  } catch (error) {
    res.status(400).send("Error in profile : " + error);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfile(req)) {
      throw new Error("Invalid Edit Request");
    }
    const loggedUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedUser[key] = req.body[key]));

    await loggedUser.save();
    res.json({
      message: "data profile is updated succesfully",
      data: loggedUser,
    });
  } catch (err) {
    res
      .status(400)
      .send("Something went wrong while editing the profile : " + err);
  }
});

profileRouter.patch("/profile/editPassword", userAuth, async (req, res) => {
  try {
    if (!passwordValidator(req)) throw new Error("no Valid fileds");
    const vaildPass = validator.isStrongPassword(req.body.password);

    if (!vaildPass) {
      throw new Error("The invalid Passwrod");
    } else {
      const newPassword = await bcrypt.hash(req.body.password, 10);
      const loggedUser = req.user;
      loggedUser.password = newPassword;
      await loggedUser.save();
      res.json({ message: "the Password Update Success", data: loggedUser });
    }
  } catch (error) {
    res.status(400).send("Error in updating the password : " + error);
  }
});

module.exports = profileRouter;
