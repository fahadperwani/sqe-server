const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

const verifyToken = (req, res, next) => {
  let token = req.header("Authorization");
  console.log(token);

  if (!token)
    return res.status(401).json({ msg: "No token, authorization denied" });

  // Remove 'Bearer ' if it exists
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length); // Remove 'Bearer ' (7 characters)
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = verifyToken;
