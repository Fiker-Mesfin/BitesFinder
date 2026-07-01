const User = require("../server/models/User");

// helper
const sendJSON = (res, status, data) => {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
  });
  res.end(JSON.stringify(data));
};

module.exports = async function profileRoute(req, res, body, authenticate) {
  const path = req.url;
  const method = req.method;

  if (path !== "/api/profile") return false;

  // ---------------- AUTH ----------------
  const userData = await authenticate(req);
  if (!userData || !userData.userId) {
    sendJSON(res, 401, { error: "Unauthorized" });
    return true;
  }

  // ---------------- GET PROFILE ----------------
  if (method === "GET") {
    try {
      const user = await User.findById(userData.userId);
      if (!user) {
        sendJSON(res, 404, { error: "User not found" });
        return true;
      }

      sendJSON(res, 200, {
        user: {
          id: user._id,
          displayName: user.displayName,
          email: user.email,
        },
      });
      return true;
    } catch (err) {
      console.error(err);
      sendJSON(res, 500, { error: "Failed to fetch profile" });
      return true;
    }
  }

  // ---------------- UPDATE PROFILE ----------------
  if (method === "PUT") {
    const { displayName } = body;
    if (!displayName) {
      sendJSON(res, 400, { error: "Display name required" });
      return true;
    }

    try {
      const user = await User.findById(userData.userId);
      if (!user) {
        sendJSON(res, 404, { error: "User not found" });
        return true;
      }

      user.displayName = displayName;
      await user.save();

      sendJSON(res, 200, {
        message: "Profile updated successfully",
        user: {
          id: user._id,
          displayName: user.displayName,
          email: user.email,
        },
      });
      return true;
    } catch (err) {
      console.error(err);
      sendJSON(res, 500, { error: "Failed to update profile" });
      return true;
    }
  }

  return false;
};
