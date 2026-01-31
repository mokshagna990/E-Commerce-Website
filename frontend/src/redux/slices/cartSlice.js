import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: JSON.parse(localStorage.getItem('cartItems')) || [],
    total: JSON.parse(localStorage.getItem('cartTotal')) || 0,
    userId: localStorage.getItem('userId') || null
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.items.find(x => x._id === item._id);
      
      if (existingItem) {
        state.items = state.items.map(x =>
          x._id === existingItem._id 
            ? { ...item, quantity: (existingItem.quantity || 1) + 1 }
            : x
        );
      } else {
        state.items = [...state.items, { ...item, quantity: 1 }];
      }
      
      state.total = state.items.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
      );

      // Save to localStorage
      localStorage.setItem('cartItems', JSON.stringify(state.items));
      localStorage.setItem('cartTotal', JSON.stringify(state.total));
    },
    
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      state.items = state.items.map(item =>
        item._id === id 
          ? { ...item, quantity: parseInt(quantity) }
          : item
      );
      
      state.total = state.items.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
      );

      // Save to localStorage
      localStorage.setItem('cartItems', JSON.stringify(state.items));
      localStorage.setItem('cartTotal', JSON.stringify(state.total));
    },
    
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(item => item._id !== id);
      
      state.total = state.items.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
      );

      // Save to localStorage
      localStorage.setItem('cartItems', JSON.stringify(state.items));
      localStorage.setItem('cartTotal', JSON.stringify(state.total));
    },
    
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      
      // Clear localStorage
      localStorage.removeItem('cartItems');
      localStorage.removeItem('cartTotal');
    },

    // New reducer to set user's cart
    setUserCart: (state, action) => {
      const { items, userId } = action.payload;
      state.items = items;
      state.userId = userId;
      state.total = items.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
      );
      
      // Save to localStorage
      localStorage.setItem('cartItems', JSON.stringify(items));
      localStorage.setItem('cartTotal', JSON.stringify(state.total));
      localStorage.setItem('userId', userId);
    }
  },
});

export const { 
  addToCart, 
  updateQuantity, 
  removeFromCart, 
  clearCart,
  setUserCart 
} = cartSlice.actions;

export default cartSlice.reducer;
