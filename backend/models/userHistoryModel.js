const mongoose = require("mongoose");

const userHistorySchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    product: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true }
});

module.exports = mongoose.model("UserHistory", userHistorySchema, "user_history");

