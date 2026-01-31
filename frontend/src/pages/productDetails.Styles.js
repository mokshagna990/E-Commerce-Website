// src/styles/ProductDetails.styles.js
import styled from 'styled-components';

export const ProductContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ImageSection = styled.div`
  img {
    width: 100%;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }
`;

export const InfoSection = styled.div`
  h1 {
    margin-top: 0;
    color: #333;
  }
`;

export const Price = styled.div`
  font-size: 2rem;
  color: #c72092;
  margin: 1rem 0;
  font-weight: bold;
`;

export const Description = styled.p`
  color: #666;
  line-height: 1.6;
  margin: 1.5rem 0;
`;

export const AddToCartSection = styled.div`
  display: flex;
  gap: 1rem;
  margin: 2rem 0;
  align-items: center;
`;

export const QuantitySelect = styled.select`
  padding: 0.8rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 1rem;
  min-width: 80px;
  
  &:focus {
    outline: none;
    border-color: #c72092;
  }
`;

export const AddButton = styled.button`
  padding: 0.8rem 2rem;
  background: linear-gradient(to right, #c72092, #6c14d0);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

export const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem 0;
  
  .stars {
    color: #ffd700;
    font-size: 1.2rem;
  }
  
  .rating-text {
    color: #666;
  }
`;

export const Features = styled.div`
  margin: 2rem 0;
  
  h2 {
    color: #333;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    margin-bottom: 0.5rem;
    padding-left: 1.5rem;
    position: relative;
    
    &:before {
      content: "•";
      color: #c72092;
      position: absolute;
      left: 0;
    }
  }
`;

export const Specifications = styled.div`
  margin: 2rem 0;
  
  h2 {
    color: #333;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .specs-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
  
  .spec-item {
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem;
    background: #f8f8f8;
    border-radius: 4px;
  }
  
  .spec-label {
    font-weight: 600;
    color: #333;
    text-transform: capitalize;
  }
`;

export const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
  color: #c72092;
`;

export const ErrorMessage = styled.div`
  text-align: center;
  color: red;
  padding: 2rem;
  font-size: 1.2rem;
`;

export const Notification = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: linear-gradient(to right, #c72092, #6c14d0);
  color: white;
  padding: 15px 25px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

// in productDetails.Styles.js
export const WishlistButton = styled.button`
  padding: 0.8rem 2rem;
  background: ${props => props.isInWishlist ? '#c72092' : 'white'};
  color: ${props => props.isInWishlist ? 'white' : '#c72092'};
  border: 2px solid #c72092;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.isInWishlist ? 'white' : '#c72092'};
    color: ${props => props.isInWishlist ? '#c72092' : 'white'};
  }
`;
