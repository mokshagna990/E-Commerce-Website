// src/pages/ProductDetails.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { addToWishlist } from '../redux/slices/wishlistSlice';
//import { useNavigate } from 'react-router-dom';
import {
  ProductContainer,
  ImageSection,
  InfoSection,
  Price,
  Description,
  AddToCartSection,
  QuantitySelect,
  AddButton,
  Rating,
  Features,
  Specifications,
  WishlistButton,
  LoadingSpinner,
  ErrorMessage,
  Notification
} from './productDetails.Styles';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const dispatch = useDispatch();
  //const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (product) {
      dispatch(addToCart({
        ...product,
        quantity: parseInt(quantity)
      }));

      if (user) {
        try {
          const response = await fetch('http://localhost:5000/api/cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`
            },
            credentials: 'include',
            body: JSON.stringify({
              productId: product._id,
              quantity: parseInt(quantity),
              price: product.price
            })
          });

          if (!response.ok) {
            throw new Error('Failed to sync cart with server');
          }
        } catch (error) {
          console.error('Error syncing cart:', error);
        }
      }

      setNotificationMessage('Product added to cart successfully!');
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    }
  };

  const handleAddToWishlist = async () => {
    if (product) {
        // Add to Redux store first
        dispatch(addToWishlist(product));

        // If user is logged in, sync with backend
        if (user && user.token) {
            try {
                const response = await fetch('http://localhost:5000/api/wishlist', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    },
                    body: JSON.stringify({
                        productId: product._id
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to sync wishlist with server');
                }
            } catch (error) {
                console.error('Error syncing wishlist:', error);
            }
        }

        // Show success message
        setNotificationMessage('Product added to wishlist successfully!');
        setShowNotification(true);
        setTimeout(() => {
            setShowNotification(false);
        }, 3000);
    }
};
  

  if (loading) return <LoadingSpinner>Loading...</LoadingSpinner>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (!product) return <ErrorMessage>Product not found</ErrorMessage>;

  return (
    <ProductContainer>
      <ImageSection>
        <img src={product.image} alt={product.name} />
      </ImageSection>
      <InfoSection>
        <h1>{product.name}</h1>
        <Price>₹{product.price.toFixed(2)}</Price>
        <Rating>
          <div className="stars">
            {'★'.repeat(Math.floor(product.rating))}
            {'☆'.repeat(5 - Math.floor(product.rating))}
          </div>
          <span className="rating-text">({product.rating} / 5)</span>
        </Rating>
        
        <Description>{product.description}</Description>
        <AddToCartSection>
          <QuantitySelect 
            value={quantity} 
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          >
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </QuantitySelect>
          
          <AddButton onClick={handleAddToCart}>
            Add to Cart
          </AddButton>
          
          <WishlistButton onClick={handleAddToWishlist}>
            Add to Wishlist
          </WishlistButton>
        </AddToCartSection>

        {product.features && (
          <Features>
            <h2>Key Features</h2>
            <ul>
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </Features>
        )}
        
        {product.specifications && (
          <Specifications>
            <h2>Specifications</h2>
            <div className="specs-grid">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="spec-item">
                  <span className="spec-label">{key}:</span>
                  <span className="spec-value">{value}</span>
                </div>
              ))}
            </div>
          </Specifications>
        )}
      </InfoSection>
      
      {showNotification && (
        <Notification>
          {notificationMessage}
        </Notification>
      )}
    </ProductContainer>
  );
};

export default ProductDetails;
