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

module.exports = { userCustomValidator };
