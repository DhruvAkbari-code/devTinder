const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");

// ! Profile api after the login
profileRouter.get("/profile", userAuth, (req, res) => {
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

module.exports = profileRouter;
