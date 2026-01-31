const express = require('express');
const router = express.Router();
const Cart = require('../models/cartModel');
const {protect} = require('../middleware/authMiddleware');

// Get user's cart
router.get('/', protect, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id })
            .populate('items.product'); // Add populate to get product details
        res.json(cart || { user: req.user._id, items: [] });
    } catch (error) {
        console.error('Cart fetch error:', error);
        res.status(500).json({ message: 'Error fetching cart' });
    }
});

router.post('/add', protect, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        
        // Fetch product details
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cart = await Cart.findOne({ userId: req.user._id });

        if (!cart) {
            // Create new cart if doesn't exist
            cart = await Cart.create({
                userId: req.user._id,
                items: [{
                    productId: product._id,
                    name: product.name,
                    price: product.price,
                    quantity: quantity,
                    image: product.image
                }]
            });
        } else {
            // Update existing cart
            const existingItem = cart.items.find(
                item => item.productId.toString() === productId
            );

            if (existingItem) {
                existingItem.quantity = quantity;
            } else {
                cart.items.push({
                    productId: product._id,
                    name: product.name,
                    price: product.price,
                    quantity: quantity,
                    image: product.image
                });
            }
            await cart.save();
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json({ 
            message: 'Failed to add item to cart',
            error: error.message 
        });
    }
});

// Update cart item
router.put('/:productId', protect, async (req, res) => {
    try {
        const { quantity } = req.body;
        
        // Validate quantity
        if (!quantity || quantity < 0) {
            return res.status(400).json({ 
                message: 'Valid quantity is required' 
            });
        }

        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => 
            item.product.toString() === req.params.productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        if (quantity === 0) {
            // Remove item if quantity is 0
            cart.items.splice(itemIndex, 1);
        } else {
            // Update quantity
            cart.items[itemIndex].quantity = quantity;
        }

        await cart.save();
        await cart.populate('items.product');
        res.json(cart);
    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({ message: 'Error updating cart' });
    }
});

// Delete item from cart
router.delete('/:productId', protect, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => 
            item.product.toString() !== req.params.productId
        );

        await cart.save();
        await cart.populate('items.product');
        res.json(cart);
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ message: 'Error removing from cart' });
    }
});

// Add a new route to clear cart
router.delete('/', protect, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = [];
        await cart.save();
        res.json({ message: 'Cart cleared successfully', cart });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({ message: 'Error clearing cart' });
    }
});

module.exports = router;
