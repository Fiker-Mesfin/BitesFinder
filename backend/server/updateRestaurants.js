// server/updateRestaurants.js
require("dotenv").config();
const mongoose = require("mongoose");
const axios = require("axios");
const Restaurant = require("./models/Restaurant");

// ------------------------
// MongoDB connection
// ------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// ------------------------
// Helpers
// ------------------------
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ------------------------
// Fetch OSM data
// ------------------------
async function fetchOSM() {
  const query = `
    [out:json][timeout:180];
    (
      node["amenity"~"restaurant|cafe|bar"](8.84,38.65,9.10,38.90);
      way["amenity"~"restaurant|cafe|bar"](8.84,38.65,9.10,38.90);
      relation["amenity"~"restaurant|cafe|bar"](8.84,38.65,9.10,38.90);
    );
    out center tags;
  `;

  const res = await axios.post(
    "https://overpass-api.de/api/interpreter",
    query,
    {
      headers: { "Content-Type": "text/plain" },
      timeout: 180000,
    },
  );

  return res.data.elements || [];
}

// ------------------------
// Update restaurants
// ------------------------
async function updateRestaurants() {
  try {
    const elements = await fetchOSM();
    console.log("Fetched elements:", elements.length);

    const restaurants = elements
      .filter((el) => el.tags && el.tags.name) // skip unnamed
      .map((el) => {
        const t = el.tags || {};
        return {
          osm_id: el.id,
          name: t.name,
          name_am: t["name:am"] || "",
          name_en: t["name:en"] || "",
          cuisine: t.cuisine || "",
          amenity: t.amenity || "",
          description: t.description || "",
          description_am: t["description:am"] || "",
          phone: t.phone || "",
          email: t.email || "",
          internet_access: t.internet_access || "",
          website: t.website || "",
          menu: t["website:menu"] || "",
          opening_hours: t.opening_hours || "",
          operator: t.operator || "",
          street: t["addr:street"] || "",
          housenumber: t["addr:housenumber"] || "",
          kebele: t["addr:kebele"] || "",
          subcity: t["addr:subcity"] || "",
          city: t["addr:city"] || "",
          lat: el.lat || (el.center && el.center.lat) || 0,
          lon: el.lon || (el.center && el.center.lon) || 0,
        };
      });

    console.log("Updating restaurants one by one...");

    for (let i = 0; i < restaurants.length; i++) {
      const r = restaurants[i];

      await Restaurant.updateOne(
        { osm_id: r.osm_id },
        { $set: r },
        { upsert: true },
      );

      if ((i + 1) % 50 === 0) {
        console.log(`✅ Updated ${i + 1}/${restaurants.length}`);
      }

      await delay(50);
    }

    console.log(
      `🎉 All ${restaurants.length} restaurants updated successfully!`,
    );
    process.exit(0);
  } catch (err) {
    console.error("❌ Error updating restaurants:", err);
    process.exit(1);
  }
}

updateRestaurants();
