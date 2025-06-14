const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    userId : { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  title: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Events", eventSchema);
