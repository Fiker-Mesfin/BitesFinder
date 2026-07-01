// backend/server/index.js
require("dotenv").config();
const http = require("http");
const url = require("url");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// ------------------ Models ------------------
const Restaurant = require("./models/Restaurant");
const User = require("./models/User");
const Comment = require("./models/Comment");
const Favorite = require("./models/Favorite");
const Otp = require("./models/Otp");
const userHandler = require("../routes/user");
// ------------------ Routes ------------------
const authHandlers = require("../routes/authRoutes");
const handleFavorites = require("../routes/favorites");
const profileRoute = require("../routes/profile");
// index.js
const handleComments = require("../routes/comments"); // path to your comments.js

// ------------------ Config ------------------
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// ------------------ Helper Functions ------------------
const sendJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
};

const parseBody = (req) =>
  new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        resolve({});
      }
    });
  });

const authenticate = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};

// ------------------ MongoDB ------------------
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ------------------ Server ------------------
const server = http.createServer(async (req, res) => {
  // ✅ GLOBAL CORS — FIXES PROFILE ISSUE
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:4000");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname.replace(/\/$/, ""); // remove trailing slash
  const method = req.method;

  let body = {};
  if (["POST", "PUT", "DELETE"].includes(method)) {
    body = await parseBody(req);
  }

  try {
    // ------------------ Auth ------------------
    if (path === "/api/auth/send-otp" && method === "POST")
      return authHandlers.sendOtpHandler(req, res, body);

    if (path === "/api/auth/verify-otp" && method === "POST")
      return authHandlers.verifyOtpHandler(req, res, body);

    if (path === "/api/auth/login" && method === "POST")
      return authHandlers.loginHandler(req, res, body);

    if (path === "/api/auth/forgot-password" && method === "POST")
      return authHandlers.forgotPasswordHandler(req, res, body);

    if (path === "/api/auth/reset-password" && method === "POST")
      return authHandlers.resetPasswordHandler(req, res, body);

    // ------------------ Restaurants ------------------
    if (path === "/api/restaurants" && method === "GET") {
      const { cuisine, location } = parsedUrl.query;
      const query = {};
      if (cuisine) query.cuisine = new RegExp(`^${cuisine}$`, "i");
      if (location) query.subcity = new RegExp(`^${location}$`, "i");

      const restaurants = await Restaurant.find(query).limit(500);
      return sendJSON(res, 200, restaurants);
    }

    if (path.startsWith("/api/restaurants/") && method === "GET") {
      const osmIdStr = path.split("/").pop();
      const osmId = Number(osmIdStr);

      if (!osmIdStr || isNaN(osmId)) {
        return sendJSON(res, 400, { error: "Invalid restaurant ID" });
      }

      const restaurant = await Restaurant.findOne({ osm_id: osmId });
      if (!restaurant) return sendJSON(res, 404, { error: "Not found" });
      return sendJSON(res, 200, restaurant);
    }

    // ------------------ Comments ------------------
    // ------------------ Comments ------------------
    if (req.url.startsWith("/api/comments")) {
      return handleComments(req, res, body); // pass parsed body
    }

    // ------------------ Favorites ------------------
    if (path.startsWith("/api/favorites")) {
      return handleFavorites(req, res, body, parsedUrl, authenticate);
    }
    if (path === "/api/user/me" && req.method === "DELETE") {
      return userHandler(req, res, body, authenticate);
    }

    // ------------------ Profile ------------------
    if (await profileRoute(req, res, body, authenticate)) return;

    // ------------------ Fallback ------------------
    sendJSON(res, 404, { error: "Route not found" });
  } catch (err) {
    console.error(err);
    sendJSON(res, 500, { error: "Internal server error" });
  }
});

// ------------------ Start ------------------
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
