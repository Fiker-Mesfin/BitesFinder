const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

module.exports = async function authenticateUser(req) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { _id: decoded.userId }; // ✅ set _id
    return req.user;
  } catch (err) {
    return null;
  }
};
