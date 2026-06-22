const validators = require("validator");
const userCustomValidator = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName || !emailId || !password) {
    throw new Error("Enter all the valid fields");
  }
  if (!validators.isStrongPassword(password)) {
    throw new Error("Enter the Strong Password");
  }
};

const validateEditProfile = (req) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "emailId",
    "age",
    "gender",
    "about",
    "skills",
  ];
  const validFiels = Object.keys(req.body).every((k) =>
    allowedFields.includes(k),
  );

  return validFiels;
};

const passwordValidator = (req) => {
  const allowedFields = ["password"];
  const validFields = Object.keys(req.body).every((k) =>
    allowedFields.includes(k),
  );
  return validFields;
};

module.exports = {
  userCustomValidator,
  validateEditProfile,
  passwordValidator,
};
