// backend/routes/user.js
const User = require("../server/models/User");

// DELETE /api/user/me
async function userHandler(req, res, body, authenticate) {
  const urlPath = req.url.split("?")[0].replace(/\/$/, ""); // remove query & trailing slash

  if (req.method === "DELETE" && urlPath === "/api/user/me") {
    const authUser = await authenticate(req);
    if (!authUser) {
      res.writeHead(401, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Unauthorized" }));
    }

    try {
      const user = await User.findByIdAndDelete(authUser.userId); // note: your auth returns {userId}

      if (!user) {
        res.writeHead(404, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "User not found" }));
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ message: "Account deleted successfully" }),
      );
    } catch (err) {
      console.error("❌ Error deleting user:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Server error" }));
    }
  }

  // fallback 404
  res.writeHead(404, { "Content-Type": "application/json" });
  return res.end(JSON.stringify({ error: "Route not found" }));
}

module.exports = userHandler;
