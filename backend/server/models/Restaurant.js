const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    osm_id: { type: Number, unique: true, index: true },

    name: String,
    name_am: String,
    name_en: String,

    cuisine: String,
    amenity: String,

    description: String,
    description_am: String,

    phone: String,
    email: String,
    website: String,
    menu: String,
    internet_access: String,
    opening_hours: String,
    operator: String,

    street: String,
    housenumber: String,
    kebele: String,
    subcity: String,
    city: String,

    lat: Number,
    lon: Number,
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
