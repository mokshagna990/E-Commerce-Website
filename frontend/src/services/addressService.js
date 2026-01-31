// frontend/src/services/addressService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/addresses';

// Get all addresses
export const getAddresses = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

// Add new address
export const addAddress = async (addressData, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const response = await axios.post(API_URL, addressData, config);
  return response.data;
};

// Update address
export const updateAddress = async (addressId, addressData, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const response = await axios.put(`${API_URL}/${addressId}`, addressData, config);
  return response.data;
};

// Delete address
export const deleteAddress = async (addressId, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const response = await axios.delete(`${API_URL}/${addressId}`, config);
  return response.data;
};
