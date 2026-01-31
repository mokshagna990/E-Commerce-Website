// backend/controllers/productController.js
const Product = require('../models/productModel');

// Get all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        //console.log('Found products:', products); // Debug log
        res.json(products);
    } catch (error) {
        console.error('Error in getProducts:', error); // Debug log
        res.status(500).json({ message: error.message });
    }
};

// Get single product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new product
const createProduct = async (req, res) => {
    try {
        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            image: req.body.image,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Add some sample products for testing
const seedProducts = async (req, res) => {
    try {
        // Clear existing products
        await Product.deleteMany({});
        
        // Insert new sample products
        const createdProducts = await Product.insertMany(sampleProducts);
        
        res.status(201).json(createdProducts);
    } catch (error) {
        console.error('Error in seedProducts:', error); // Debug log
        res.status(400).json({ message: error.message });
    }
};

// Update product
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            Object.assign(product, req.body);
            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    seedProducts  // Don't forget to export the seed function
};
