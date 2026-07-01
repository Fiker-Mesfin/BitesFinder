const url = require("url");
const Restaurant = require("../server/models/Restaurant"); // adjust path as needed

async function handleRestaurants(req, res) {
  const parsedUrl = url.parse(req.url, true); // parse query string
  const path = parsedUrl.pathname.replace(/\/$/, ""); // remove trailing slash

  // Only handle GET /api/restaurants
  if (req.method === "GET" && path === "/api/restaurants") {
    try {
      const { subcity, cuisine, limit } = parsedUrl.query;

      // Build query dynamically
      const query = {};
      if (subcity) query.subcity = subcity;
      if (cuisine) query.cuisine = { $regex: cuisine, $options: "i" };

      const restaurants = await Restaurant.find(query).limit(
        parseInt(limit) || 50,
      );

      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(restaurants));
    } catch (err) {
      console.error("Error fetching restaurants from MongoDB:", err.message);
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Server error" }));
    }
  }

  // If route does not match
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Route not found" }));
}

module.exports = handleRestaurants;
