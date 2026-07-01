const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
  restaurantId: { type: Number, required: true }, // Make sure frontend sends number
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", commentSchema);
