const adminAuth = (req, res, next) => {
  const token = "xyzabc";
  const isAuthorized = token === "xyz";
  !isAuthorized ? res.status(401).send("Not Authorized") : next();
};

module.exports = {
  adminAuth,
};
