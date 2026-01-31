const Product = require("../models/productModel");
const UserHistory = require("../models/userHistoryModel");

const getRecommendations = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Fetch user purchase history
        const userData = await UserHistory.aggregate([
            { $match: { user_id: { $regex: new RegExp("^" + userId + "$", "i") } } }, // Case-insensitive match
            {
                $group: {
                    _id: "$user_id",
                    categories: { $addToSet: "$category" },
                    average_spent: { $avg: "$price" }
                }
            }
        ]);

        if (!userData.length) {
            console.log(`No purchase history found for user: ${userId}`);
            return res.json([]); // Return an empty array instead of an error
        }

        const { categories, average_spent } = userData[0];

        console.log(`User ${userId} - Categories: ${categories}, Avg Spent: ₹${average_spent.toFixed(2)}`);

        // Fetch products from the same categories, within ±20% of user's avg spending
        let recommendedProducts = await Product.find({
            category: { $in: categories },
            price: { $gte: average_spent * 0.8, $lte: average_spent * 1.2 }
        }).limit(10);

        if (!recommendedProducts.length) {
            console.log(`No exact price matches for user ${userId}, fetching alternative recommendations...`);
            recommendedProducts = await Product.find({
                category: { $in: categories }
            }).limit(10); // Fetch general category-based recommendations
        }

        res.json(recommendedProducts);
    } catch (error) {
        console.error("Error fetching recommendations:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getRecommendations };
