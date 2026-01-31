const express = require("express");
const router = express.Router();
const { getRecommendations } = require("../controllers/recommendationController");

// Route for fetching recommendations
router.get("/:userId", getRecommendations);

module.exports = router;
