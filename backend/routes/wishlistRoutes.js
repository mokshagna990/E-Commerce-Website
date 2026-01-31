// backend/routes/wishlistRoutes.js
const express = require('express');
const router = express.Router();
const Wishlist = require('../models/wishlistModel');
const { protect } = require('../middleware/authMiddleware');

// Define route handlers separately
const getUserWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user._id })
            .populate('products');
        
        if (!wishlist) {
            wishlist = new Wishlist({
                user: req.user._id,
                products: []
            });
            await wishlist.save();
        }
        
        res.json(wishlist);
    } catch (error) {
        console.error('Wishlist fetch error:', error);
        res.status(500).json({ message: 'Error fetching wishlist' });
    }
};

const addToWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user._id });
        
        if (!wishlist) {
            wishlist = new Wishlist({
                user: req.user._id,
                products: [req.params.productId]
            });
        } else if (!wishlist.products.includes(req.params.productId)) {
            wishlist.products.push(req.params.productId);
        }
        
        await wishlist.save();
        const populatedWishlist = await Wishlist.findById(wishlist._id)
            .populate('products');
        res.json(populatedWishlist);
    } catch (error) {
        console.error('Add to wishlist error:', error);
        res.status(500).json({ message: 'Error adding to wishlist' });
    }
};

const removeFromWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user._id });
        
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }
        
        wishlist.products = wishlist.products.filter(
            product => product.toString() !== req.params.productId
        );
        
        await wishlist.save();
        const populatedWishlist = await Wishlist.findById(wishlist._id)
            .populate('products');
        res.json(populatedWishlist);
    } catch (error) {
        console.error('Remove from wishlist error:', error);
        res.status(500).json({ message: 'Error removing from wishlist' });
    }
};

const testRoute = (req, res) => {
    res.json({ message: 'Wishlist routes are working' });
};

// Apply routes
router.get('/test', testRoute);
router.get('/', protect, getUserWishlist);
router.post('/add/:productId', protect, addToWishlist);
router.delete('/remove/:productId', protect, removeFromWishlist);

module.exports = router;
