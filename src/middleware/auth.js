const jwt = require("jsonwebtoken");
const Users = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { jwtToken } = req.cookies;
    if (!jwtToken) {
      throw new Error("Token not valid");
    }

    const verifyJwt = await jwt.verify(jwtToken, "dhruv");

    const { _id } = verifyJwt;

    const user = await Users.findById(_id);

    if (!user) {
      throw new error("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
};

module.exports = { userAuth };
