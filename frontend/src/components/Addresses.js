// frontend/src/components/Addresses.js
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { 
  getAddresses, 
  addAddress, 
  updateAddress, 
  deleteAddress 
} from '../services/addressService';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Grid,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const AddressForm = ({ address, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: address?.fullName || '',
    address: address?.address || '',
    city: address?.city || '',
    pincode: address?.pincode || '',
    phoneNumber: address?.phoneNumber || ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogContent>
        <TextField
          fullWidth
          margin="dense"
          name="fullName"
          label="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="dense"
          name="address"
          label="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="dense"
          name="city"
          label="City"
          value={formData.city}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="dense"
          name="pincode"
          label="Pincode"
          value={formData.pincode}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="dense"
          name="phoneNumber"
          label="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary">
          {address ? 'Update' : 'Add'} Address
        </Button>
      </DialogActions>
    </form>
  );
};

const AddressCard = ({ address, onEdit, onDelete }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{address.fullName}</Typography>
          <Box>
            <IconButton onClick={() => onEdit(address)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => onDelete(address._id)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
        <Typography>{address.address}</Typography>
        <Typography>{address.city} - {address.pincode}</Typography>
        <Typography>Phone: {address.phoneNumber}</Typography>
      </CardContent>
    </Card>
  );
};

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const { userInfo } = useSelector((state) => state.auth);

  const fetchAddresses = useCallback(async () => {
    try {
      const data = await getAddresses(userInfo.token);
      setAddresses(data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  }, [userInfo.token]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleAddAddress = async (formData) => {
    try {
      await addAddress(formData, userInfo.token);
      setOpenDialog(false);
      fetchAddresses();
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  const handleUpdateAddress = async (formData) => {
    try {
      await updateAddress(selectedAddress._id, formData, userInfo.token);
      setOpenDialog(false);
      setSelectedAddress(null);
      fetchAddresses();
    } catch (error) {
      console.error('Error updating address:', error);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteAddress(addressId, userInfo.token);
        fetchAddresses();
      } catch (error) {
        console.error('Error deleting address:', error);
      }
    }
  };

  const handleEdit = (address) => {
    setSelectedAddress(address);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedAddress(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4">My Addresses</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => setOpenDialog(true)}
        >
          Add New Address
        </Button>
      </Box>

      <Grid container spacing={2}>
        {addresses.map((address) => (
          <Grid item xs={12} md={6} key={address._id}>
            <AddressCard
              address={address}
              onEdit={handleEdit}
              onDelete={handleDeleteAddress}
            />
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={openDialog} 
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedAddress ? 'Edit Address' : 'Add New Address'}
        </DialogTitle>
        <AddressForm
          address={selectedAddress}
          onSubmit={selectedAddress ? handleUpdateAddress : handleAddAddress}
          onClose={handleClose}
        />
      </Dialog>
    </Box>
  );
};

export default Addresses;
