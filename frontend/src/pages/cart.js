import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateQuantity, removeFromCart, clearCart } from '../redux/slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const DeliveryAddressModal = ({ onClose, onConfirm, total }) => {
  const [deliveryDetails, setDeliveryDetails] = useState({
    fullName: '',
    address: '',
    city: '',
    pincode: '',
    phone: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!/^\d{6}$/.test(deliveryDetails.pincode)) {
      setError('Please enter a valid 6-digit pincode');
      return;
    }
    if (!/^\d{10}$/.test(deliveryDetails.phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    
    onConfirm(deliveryDetails);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Delivery Details</h2>
        <p className="total-amount">Total Amount: ₹{total.toFixed(2)}</p>
        {error && <p className="error-message">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name:</label>
            <input
              type="text"
              required
              value={deliveryDetails.fullName}
              onChange={(e) => setDeliveryDetails({...deliveryDetails, fullName: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Delivery Address:</label>
            <textarea
              required
              value={deliveryDetails.address}
              onChange={(e) => setDeliveryDetails({...deliveryDetails, address: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>City:</label>
            <input
              type="text"
              required
              value={deliveryDetails.city}
              onChange={(e) => setDeliveryDetails({...deliveryDetails, city: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Pincode:</label>
            <input
              type="text"
              required
              maxLength="6"
              value={deliveryDetails.pincode}
              onChange={(e) => setDeliveryDetails({...deliveryDetails, pincode: e.target.value.replace(/\D/g, '')})}
            />
          </div>

          <div className="form-group">
            <label>Phone Number:</label>
            <input
              type="tel"
              required
              maxLength="10"
              value={deliveryDetails.phone}
              onChange={(e) => setDeliveryDetails({...deliveryDetails, phone: e.target.value.replace(/\D/g, '')})}
            />
          </div>

          <div className="delivery-info">
            <p>Expected Delivery: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
            <p>Payment Method: Cash on Delivery</p>
          </div>

          <div className="modal-actions">
            <button type="submit" className="confirm-button">
              Confirm Order
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total } = useSelector(state => state.cart);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Keep your existing handlers
  const handleQuantityChange = (id, quantity) => {
    const newQuantity = Math.max(1, parseInt(quantity) || 1);
    dispatch(updateQuantity({ id: id, quantity: newQuantity }));
  };

  const handleRemove = (id) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      dispatch(removeFromCart(id));
    }
  };

  const handleDeliveryConfirm = async (deliveryDetails) => {
      setIsProcessing(true);
      try {
          const token = localStorage.getItem('token');
          console.log('Sending request with token:', token); // Debug log
  
          const orderData = {
              items,
              total,
              deliveryDetails
          };
          console.log('Sending order data:', orderData); // Debug log
  
          const response = await fetch('http://localhost:5000/api/orders/create', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(orderData)
          });
  
          console.log('Response status:', response.status); // Debug log
          const data = await response.json();
          console.log('Response data:', data); // Debug log
  
          if (response.ok) {
              dispatch(clearCart());
              alert('Order placed successfully! You will receive confirmation on your phone.');
              navigate('/');
          } else {
              throw new Error(data.message || 'Failed to place order');
          }
      } catch (error) {
          console.error('Order error:', error); // Debug log
          alert('Error placing order: ' + error.message);
      } finally {
          setIsProcessing(false);
          setShowDeliveryModal(false);
      }
  };
  

  const handleCheckout = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to place an order');
        navigate('/login');
        return;
    }
    if (!items.length) {
        alert('Your cart is empty!');
        return;
    }
    setShowDeliveryModal(true);
  };

  // Keep your existing return statement with cart items display
  return (
    <div className="cart-container">
      <h1>Shopping Cart</h1>
      {items.length === 0 ? (
        <div className="empty-cart-message">
          Your cart is empty. Continue shopping to add items to your cart.
        </div>
      ) : (
        <>
          {items.map(item => (
            <div className="cart-item" key={item._id}>
              <img 
                className="item-image" 
                src={item.image} 
                alt={item.name} 
              />
              <div className="item-details">
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p>₹{item.price.toFixed(2)}</p>
                </div>
                <div className="item-controls">
                  <input
                    className="quantity-input"
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                  />
                  <button 
                    className="remove-button"
                    onClick={() => handleRemove(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="cart-total">
            <h3>
              Subtotal ({items.reduce((acc, item) => acc + item.quantity, 0)} items): 
              ₹{total.toFixed(2)}
            </h3>
            <button 
              className="checkout-button"
              onClick={handleCheckout}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Place Order (Cash on Delivery)'}
            </button>
          </div>
        </>
      )}

      {showDeliveryModal && (
        <DeliveryAddressModal 
          onClose={() => setShowDeliveryModal(false)}
          onConfirm={handleDeliveryConfirm}
          total={total}
        />
      )}
    </div>
  );
};

export default Cart;
