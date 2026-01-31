import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist, selectWishlistItems } from '../redux/slices/wishlistSlice';
import '../index.css';

function ProductCard({ product }) {
  const { name, price, description, image, _id } = product;
  const dispatch = useDispatch();
  const [showNotification, setShowNotification] = useState(false);
  const [showWishlistNotification, setShowWishlistNotification] = useState(false);
  
  // Use the selector to safely get wishlist items
  const wishlistItems = useSelector(selectWishlistItems);
  const isInWishlist = wishlistItems.some(item => item._id === _id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart({
      ...product,
      quantity: 1
    }));
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    try {
      if (isInWishlist) {
        dispatch(removeFromWishlist(_id));
      } else {
        dispatch(addToWishlist(product));
      }
      setShowWishlistNotification(true);
      setTimeout(() => setShowWishlistNotification(false), 2000);
    } catch (error) {
      console.error('Wishlist operation failed:', error);
    }
  };

  return (
    <>
      {showNotification && (
        <div className="notification">
          Added to cart successfully!
        </div>
      )}
      {showWishlistNotification && (
        <div className="notification">
          {isInWishlist ? 'Removed from wishlist!' : 'Added to wishlist!'}
        </div>
      )}
      <div className="card">
        <Link to={`/product/${_id}`} className="card-link">
          <div className="card-content">
            <img 
              className="product-image"
              src={`${process.env.PUBLIC_URL}${image}`} 
              alt={name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `${process.env.PUBLIC_URL}/images/default.jpg`;
              }}
            />
            <h3 className="product-name">{name}</h3>
            <p className="product-price">₹{price.toLocaleString('en-IN')}</p>
            <p className="product-description">{description}</p>
          </div>
        </Link>
        <div className="button-container">
          <button className="add-to-cart-button" onClick={handleAddToCart}>
            Add to Cart
          </button>
          <button 
            className={`wishlist-button ${isInWishlist ? 'in-wishlist' : ''}`} 
            onClick={handleWishlistToggle}
          >
            {isInWishlist ? '❤️ Remove from Wishlist' : '🤍 Add to Wishlist'}
          </button>
        </div>
      </div>
    </>
  );
}

export default ProductCard;
