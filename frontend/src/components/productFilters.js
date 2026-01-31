// src/components/ProductFilters.js
import React from 'react';
import styled from 'styled-components';

const FilterContainer = styled.div`
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const FilterSection = styled.div`
  margin-bottom: 1rem;

  h3 {
    margin-top: 0;
    color: #333;
  }
`;

const PriceRange = styled.div`
  display: flex;
  gap: 1rem;
  
  input {
    width: 100px;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const ProductFilters = ({ filters, setFilters }) => {
  return (
    <FilterContainer>
      <FilterSection>
        <h3>Price Range</h3>
        <PriceRange>
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => setFilters({
              ...filters,
              minPrice: e.target.value
            })}
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => setFilters({
              ...filters,
              maxPrice: e.target.value
            })}
          />
        </PriceRange>
      </FilterSection>

      <FilterSection>
        <h3>Categories</h3>
        <CategoryList>
          {['Electronics', 'Clothing', 'Books', 'Home'].map(category => (
            <label key={category}>
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={(e) => {
                  const newCategories = e.target.checked
                    ? [...filters.categories, category]
                    : filters.categories.filter(c => c !== category);
                  setFilters({
                    ...filters,
                    categories: newCategories
                  });
                }}
              />
              {category}
            </label>
          ))}
        </CategoryList>
      </FilterSection>
    </FilterContainer>
  );
};

export default ProductFilters;
