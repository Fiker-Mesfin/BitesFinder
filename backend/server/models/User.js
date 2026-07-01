// backend/server/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  password: { type: String, required: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" }], // store Restaurant _id
});

module.exports = mongoose.model("User", userSchema);
