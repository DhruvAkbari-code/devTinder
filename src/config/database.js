const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://addhruvakbari:Dhruv001@tinder.s34enxy.mongodb.net/devTinder",
  );
};

module.exports = connectDb;
