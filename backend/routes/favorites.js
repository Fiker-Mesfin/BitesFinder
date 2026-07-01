// backend/routes/favorites.js
const Favorite = require("../server/models/Favorite");
const Restaurant = require("../server/models/Restaurant");

// Helper to send JSON
const sendJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
  });
  res.end(JSON.stringify(data));
};

module.exports = async function handleFavorites(
  req,
  res,
  body,
  parsedUrl,
  authenticate,
) {
  const path = parsedUrl.pathname;
  const method = req.method;

  // Authenticate user
  const userData = await authenticate(req);
  if (!userData) return sendJSON(res, 401, { error: "Unauthorized" });

  const userId = userData.id || userData.userId;

  // ---------------- GET /api/favorites ----------------
  // GET /api/favorites
  if (path === "/api/favorites" && method === "GET") {
    try {
      const favorites = await Favorite.find({ userId });

      const osmIds = favorites.map((f) => Number(f.restaurantId));

      const restaurants = await Restaurant.find({
        osm_id: { $in: osmIds },
      });

      return sendJSON(res, 200, restaurants);
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
      return sendJSON(res, 500, { error: "Failed to fetch favorites" });
    }
  }

  // ---------------- POST /api/favorites ----------------
  if (path === "/api/favorites" && method === "POST") {
    const { restaurantId } = body;
    if (!restaurantId)
      return sendJSON(res, 400, { error: "restaurantId required" });

    try {
      const existing = await Favorite.findOne({ userId, restaurantId });
      if (existing) return sendJSON(res, 400, { error: "Already favorited" });

      const favorite = await Favorite.create({ userId, restaurantId });
      return sendJSON(res, 201, favorite);
    } catch (err) {
      console.error("Failed to add favorite:", err);
      return sendJSON(res, 500, { error: "Failed to add favorite" });
    }
  }

  // ---------------- DELETE /api/favorites ----------------
  if (path === "/api/favorites" && method === "DELETE") {
    const { restaurantId } = body;
    if (!restaurantId)
      return sendJSON(res, 400, { error: "restaurantId required" });

    try {
      const deleted = await Favorite.findOneAndDelete({ userId, restaurantId });
      if (!deleted) return sendJSON(res, 404, { error: "Favorite not found" });

      return sendJSON(res, 200, { message: "Removed from favorites" });
    } catch (err) {
      console.error("Failed to remove favorite:", err);
      return sendJSON(res, 500, { error: "Failed to remove favorite" });
    }
  }

  // ---------------- Fallback ----------------
  return sendJSON(res, 404, { error: "Favorites route not found" });
};
