const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email Id" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not porper");
        }
      },
    },
    photoUrl: {
      type: String,
    },
    about: {
      type: String,
      default: "You can enter about section of yourself",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true },
);

userSchema.methods.getJWT = function () {
  return jwt.sign({ _id: this._id }, "dhruv", {
    expiresIn: "1d",
  });
};

userSchema.methods.ValidatedPass = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Users", userSchema);
