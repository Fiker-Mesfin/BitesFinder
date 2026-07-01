// server/scripts/fetchRestaurants.js
const mongoose = require("mongoose");
const axios = require("axios");
const Restaurant = require("../models/Restaurant.js");

// ------------------------
// 1️⃣ Connect to MongoDB Atlas
// ------------------------
const uri =
  "mongodb://bitesFinder_user:nLK02LE4ApJhxnJj@cluster-1-shard-00-00.i5u5wuc.mongodb.net:27017,cluster-1-shard-00-01.i5u5wuc.mongodb.net:27017,cluster-1-shard-00-02.i5u5wuc.mongodb.net:27017/BitesFinder?ssl=true&replicaSet=atlas-1-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // wait up to 30s
    socketTimeoutMS: 45000, // socket timeout 45s
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ------------------------
// 2️⃣ Fetch from Overpass API
// ------------------------
async function fetchRestaurantsFromOSM() {
  const query = `
    [out:json][timeout:180];
    (
      node["amenity"~"restaurant|fast_food|cafe|bar|food_court"](8.84,38.65,9.10,38.90);
      way["amenity"~"restaurant|fast_food|cafe|bar|food_court"](8.84,38.65,9.10,38.90);
      relation["amenity"~"restaurant|fast_food|cafe|bar|food_court"](8.84,38.65,9.10,38.90);
    );
    out center tags;
  `;

  const url = "https://overpass-api.de/api/interpreter";

  try {
    const response = await axios.post(url, query, {
      headers: { "Content-Type": "text/plain" },
      timeout: 180000, // 3 minutes
    });

    return response.data.elements || [];
  } catch (err) {
    console.error("Error fetching from OSM:", err.message);
    return [];
  }
}

// ------------------------
// 3️⃣ Save restaurants to MongoDB in batches
// ------------------------
async function saveRestaurantsToMongo(restaurants) {
  const BATCH_SIZE = 200; // avoid timeouts for large dataset

  for (let i = 0; i < restaurants.length; i += BATCH_SIZE) {
    const batch = restaurants.slice(i, i + BATCH_SIZE);
    const bulkOps = batch.map((r) => ({
      updateOne: {
        filter: { osm_id: r.osm_id },
        update: r,
        upsert: true,
      },
    }));

    try {
      await Restaurant.bulkWrite(bulkOps);
      console.log(
        `Saved batch ${i / BATCH_SIZE + 1} (${batch.length} restaurants)`,
      );
    } catch (err) {
      console.error("Error saving batch:", err.message);
    }
  }
}

// ------------------------
// 4️⃣ Main function
// ------------------------
async function main() {
  const elements = await fetchRestaurantsFromOSM();
  console.log("Fetched elements:", elements.length);

  const restaurants = elements.map((el) => {
    const tags = el.tags || {};
    return {
      osm_id: el.id,
      name: tags.name || "",
      name_am: tags["name:am"] || "",
      name_en: tags["name:en"] || "",
      cuisine: tags.cuisine || "",
      amenity: tags.amenity || "",
      description: tags.description || "",
      description_am: tags["description:am"] || "",
      phone: tags.phone || "",
      street: tags["addr:street"] || "",
      housenumber: tags["addr:housenumber"] || "",
      kebele: tags["addr:kebele"] || "",
      subcity: tags["addr:subcity"] || "",
      city: tags["addr:city"] || "",
      lat: el.lat || (el.center && el.center.lat) || 0,
      lon: el.lon || (el.center && el.center.lon) || 0,
    };
  });

  await saveRestaurantsToMongo(restaurants);
  console.log(`All ${restaurants.length} restaurants saved successfully!`);
  process.exit(0);
}

main();
