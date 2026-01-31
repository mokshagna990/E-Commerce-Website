// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel');
const {protect} = require('../middleware/authMiddleware');

console.log('Order routes loaded');

router.post('/create', protect, async (req, res) => {
    console.log('Received order request');
    try {
        const { items, total, deliveryDetails } = req.body;
        
        // Create the order document directly using create() method
        const savedOrder = await Order.create({
            userId: req.user._id,
            items: items.map(item => ({
                productId: item._id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            })),
            deliveryDetails,
            total,
            expectedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            status: 'Confirmed'
        });
        res.status(201).json({
            success: true,
            orderId: savedOrder._id,
            message: 'Order placed successfully'
        });
    } catch (error) {
        console.error('Detailed order creation error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Failed to create order',
            error: error.message
        });
    }
});

// Get user's orders
router.get('/user-orders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id })
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

module.exports = router;
