import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromWishlist } from '../redux/slices/wishlistSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const WishlistContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const WishlistItem = styled.div`
  display: flex;
  padding: 20px;
  border: 1px solid #ddd;
  margin-bottom: 20px;
  border-radius: 8px;
  background: white;
`;

const ItemImage = styled.img`
  width: 150px;
  height: 150px;
  object-fit: cover;
  margin-right: 20px;
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${props => props.primary ? '#c72092' : '#6c757d'};
  color: white;
  
  &:hover {
    opacity: 0.9;
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 8px;
  margin-top: 20px;
`;

const Wishlist = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const handleRemoveFromWishlist = (productId) => {
    dispatch(removeFromWishlist(productId));
  };

  const handleMoveToCart = (product) => {
    dispatch(addToCart({ ...product, quantity: 1 }));
    dispatch(removeFromWishlist(product._id));
  };

  if (wishlistItems.length === 0) {
    return (
      <WishlistContainer>
        <EmptyMessage>
          <h2>Your wishlist is empty</h2>
          <p>Add items to your wishlist to save them for later!</p>
          <Link to="/">
            <Button primary>Continue Shopping</Button>
          </Link>
        </EmptyMessage>
      </WishlistContainer>
    );
  }

  return (
    <WishlistContainer>
      <h1>My Wishlist</h1>
      {wishlistItems.map((item) => (
        <WishlistItem key={item._id}>
          <ItemImage src={item.image} alt={item.name} />
          <ItemDetails>
            <h3>{item.name}</h3>
            <p>${item.price.toFixed(2)}</p>
            <ItemActions>
              <Button primary onClick={() => handleMoveToCart(item)}>
                Move to Cart
              </Button>
              <Button onClick={() => handleRemoveFromWishlist(item._id)}>
                Remove
              </Button>
            </ItemActions>
          </ItemDetails>
        </WishlistItem>
      ))}
    </WishlistContainer>
  );
};

export default Wishlist;
