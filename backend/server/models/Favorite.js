const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  restaurantId: { type: Number, required: true }, // numeric OSM ID
});

module.exports = mongoose.model("Favorite", favoriteSchema);
