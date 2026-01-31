const express = require('express');
const { getPredictedSales } = require('../controllers/analyticsController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// This is the route you were asking about
router.get('/predict-sales', protect, admin, getPredictedSales);

module.exports = router;
