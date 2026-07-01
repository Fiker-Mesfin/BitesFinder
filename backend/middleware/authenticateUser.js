const jwt = require("jsonwebtoken");
const User = require("../server/models/User");
const sendJSON = require("../server/utils/sendJSON");

module.exports = async function authenticateUser(req, res) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    sendJSON(res, 401, { error: "Unauthorized" });
    return null;
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      sendJSON(res, 404, { error: "User not found" });
      return null;
    }

    return user;
  } catch (err) {
    sendJSON(res, 401, { error: "Invalid token" });
    return null;
  }
};
