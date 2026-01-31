const fs = require('fs');
const path = require('path');
const predictSales = require('../utils/predictSales');

const getPredictedSales = async (req, res) => {
    try {
        await predictSales();

        const data = fs.readFileSync(path.join(__dirname, '../python/predicted_sales.json'));
        const predictions = JSON.parse(data);

        res.json(predictions);
    } catch (error) {
        res.status(500).json({ message: "Prediction error", error });
    }
};
