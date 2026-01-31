import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { setWishlist } from '../../redux/slices/wishlistSlice';
import './header.css';

function Header() {
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserWishlist = async () => {
      if (user && user.token) {
        try {
          const response = await fetch('http://localhost:5000/api/wishlist', {
            headers: {
              'Authorization': `Bearer ${user.token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            dispatch(setWishlist(data));
          }
        } catch (error) {
          console.error('Error fetching wishlist:', error);
        }
      }
    };

    fetchUserWishlist();
  }, [user, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(setWishlist([]));
    navigate('/');
  };

  return (
    <header className="header-container">
        <div className="nav-container">
          <Link to="/" className="logo">
            Enchante
          </Link>
          <nav className="nav-links">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/cart" className="nav-link cart-link">
              Cart
              {cartItems?.length > 0 && (
                <span className="cart-count">{cartItems.length}</span>
              )}
            </Link>
            <Link to="/wishlist" className="nav-link wishlist-link">
              Wishlist
              {wishlistItems?.length > 0 && (
                <span className="wishlist-count">{wishlistItems.length}</span>
              )}
            </Link>

            {user ? (
              <>
                <Link to="/profile" className="nav-link">
                  Profile
                </Link>
                {/* Only show Admin link if user is admin */}
    {user.isAdmin && (
      <Link to="/admin" className="nav-link">
        Admin
      </Link>
    )}
                <Link 
                  to="#" 
                  onClick={handleLogout} 
                  className="nav-link"
                >
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/register" className="nav-link">
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
  );
}

export default Header;