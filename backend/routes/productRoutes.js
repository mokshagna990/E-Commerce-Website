const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');
const {protect} = require('../middleware/authMiddleware');
const mongoose = require('mongoose');


// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products' });
    }
});


// Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Error fetching product' });
    }
});

router.put('/:id', protect, async (req, res) => {
    try {
        const { price } = req.body;
        console.log('Received price update request:', { price }); // Debug log

        // Validate price
        if (!price || price <= 0) {
            return res.status(400).json({ message: 'Price must be greater than 0' });
        }
        const result = await Product.collection.updateOne(
            { _id: new mongoose.Types.ObjectId(req.params.id) },
            { $set: { price: parseFloat(price) } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Fetch the updated product to return
        const updatedProduct = await Product.findById(req.params.id);   
        res.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ 
            message: 'Error updating product',
            error: error.message 
        });
    }
});

// Create product
router.post('/', protect, async (req, res) => {
    try {
        const product = new Product(req.body);
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Error creating product' });
    }
});

// Delete product
router.delete('/:id', protect, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Error deleting product' });
    }
});

// Seed products (optional)
router.post('/seed', protect, async (req, res) => {
    try {
        // Add your seed data logic here
        res.json({ message: 'Products seeded successfully' });
    } catch (error) {
        console.error('Error seeding products:', error);
        res.status(500).json({ message: 'Error seeding products' });
    }
});

module.exports = router;
