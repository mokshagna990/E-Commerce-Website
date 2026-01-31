import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
export const register = createAsyncThunk(
'auth/register',
async (userData) => {
const response = await fetch('http://localhost:5000/api/users/register', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify(userData),
});
const data = await response.json();
if (!response.ok) {
throw new Error(data.message || 'Registration failed');
}
localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
return data;
}
);
export const login = createAsyncThunk(
'auth/login',
async (credentials) => {
const response = await fetch('http://localhost:5000/api/users/login', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify(credentials),
});
const data = await response.json();
if (!response.ok) {
throw new Error(data.message || 'Login failed');
}
localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data._id);
return data;
}
);
export const logout = createAsyncThunk(
'auth/logout',
async (_, { dispatch }) => {
localStorage.removeItem('user');
localStorage.removeItem('token');
localStorage.removeItem('cartItems');
dispatch({ type: 'cart/clearCart' });
}
);
const authSlice = createSlice({
name: 'auth',
initialState: {
user: JSON.parse(localStorage.getItem('user')) || null,
loading: false,
error: null,
},
reducers: {
clearError: (state) => {
state.error = null;
},
},
extraReducers: (builder) => {
builder
.addCase(register.pending, (state) => {
state.loading = true;
state.error = null;
})
.addCase(register.fulfilled, (state, action) => {
state.loading = false;
state.user = action.payload; 
state.error = null;
})
.addCase(register.rejected, (state, action) => {
state.loading = false;
state.error = action.error.message;
})
.addCase(login.pending, (state) => {
state.loading = true;
state.error = null;
})
.addCase(login.fulfilled, (state, action) => {
state.loading = false;
state.user = action.payload;
state.error = null;
})
.addCase(login.rejected, (state, action) => {
state.loading = false;
state.error = action.error.message;
})
.addCase(logout.fulfilled, (state) => {
state.user = null;
state.loading = false;
state.error = null;
});
},
});
export const { clearError,updateUser} = authSlice.actions;
export default authSlice.reducer;