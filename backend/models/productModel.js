// backend/models/productModel.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  countInStock: {
    type: Number,
    required: true,
    default: 0
  },
  rating: {
    type: Number,
    required: true,
    default: 0
  },
  tags: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

productSchema.index({ 
  name: 'text', 
  description: 'text', 
  category: 'text',
  tags: 'text' 
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;