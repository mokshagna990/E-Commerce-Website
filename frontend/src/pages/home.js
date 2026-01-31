import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import Recommendations from '../components/Recommendations';
import LoadingSpinner from '../components/loadingSpinner';
import { Link } from 'react-router-dom';
import '../index.css';

function Home() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const userId = "user001"; // Fetch dynamically based on logged-in user

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const categories = ['all', ...new Set(products.map(product => product.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="main-content">
      <h1 className="title">Our Products</h1>
      <Recommendations userId={userId} />

      <div className="filter-container">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="category-select">
          {categories.map(category => (
            <option key={category} value={category}>{category === 'all' ? 'All Categories' : category}</option>
          ))}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
          <option value="default">Default Sorting</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="name">Name: A to Z</option>
          <option value="rating">Rating: High to Low</option>
        </select>
      </div>

      <div className="products-grid">
        {sortedProducts.length > 0 ? (
          sortedProducts.map((product) => (
            <div key={product._id} className="product-card">
              <Link to={`/product/${product._id}`} className="product-link">
                <img src={product.image} alt={product.name} className="product-image" />
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">₹{product.price.toFixed(2)}</p>
                  <div className="product-rating">Rating: {product.rating}/5</div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className="no-products">No products found</div>
        )}
      </div>
    </div>
  );
}

export default Home;
