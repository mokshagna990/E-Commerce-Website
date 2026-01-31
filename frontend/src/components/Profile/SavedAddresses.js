import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddresses, addAddress, updateAddress, deleteAddress } from '../../redux/slices/addressSlice';
import '../../pages/profile.css';

const SavedAddresses = () => {
  const dispatch = useDispatch();
  const { addresses, loading, error } = useSelector((state) => state.address);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    pincode: '',
    phoneNumber: ''
  });

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        // If editing, update the address
        await dispatch(updateAddress({ 
          addressId: editingAddress._id, 
          addressData: newAddress 
        })).unwrap();
        console.log('Address updated successfully');
      } else {
        // If not editing, add new address
        await dispatch(addAddress(newAddress)).unwrap();
        console.log('New address added successfully');
      }
      // Reset form and state after successful submission
      setShowAddForm(false);
      setEditingAddress(null);
      setNewAddress({
        fullName: '',
        address: '',
        city: '',
        pincode: '',
        phoneNumber: ''
      });
    } catch (error) {
      console.error('Operation failed:', error);
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setNewAddress({
      fullName: address.fullName,
      address: address.address,
      city: address.city,
      pincode: address.pincode,
      phoneNumber: address.phoneNumber
    });
    setShowAddForm(true);
  };

  const handleDelete = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await dispatch(deleteAddress(addressId)).unwrap();
        console.log('Address deleted successfully');
      } catch (error) {
        console.error('Failed to delete address:', error);
      }
    }
  };

  const handleChange = (e) => {
    setNewAddress({
      ...newAddress,
      [e.target.name]: e.target.value
    });
  };

  if (loading) return <div>Loading addresses...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="saved-addresses">
      <div className="addresses-header">
        <h2>Saved Addresses</h2>
        <button 
          className="add-address-btn"
          onClick={() => {
            setShowAddForm(true);
            setEditingAddress(null);
            setNewAddress({
              fullName: '',
              address: '',
              city: '',
              pincode: '',
              phoneNumber: ''
            });
          }}
        >
          Add New Address
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="address-form">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={newAddress.fullName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={newAddress.address}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={newAddress.city}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={newAddress.pincode}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number"
            value={newAddress.phoneNumber}
            onChange={handleChange}
            required
          />
          <div className="form-buttons">
            <button type="submit">
              {editingAddress ? 'Update Address' : 'Save Address'}
            </button>
            <button 
              type="button" 
              onClick={() => {
                setShowAddForm(false);
                setEditingAddress(null);
                setNewAddress({
                  fullName: '',
                  address: '',
                  city: '',
                  pincode: '',
                  phoneNumber: ''
                });
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="addresses-list">
        {addresses.length > 0 ? (
          addresses.map((address) => (
            <div key={address._id} className="address-card">
              <div className="address-info">
                <p className="name">{address.fullName}</p>
                <p>{address.address}</p>
                <p>{address.city} - {address.pincode}</p>
                <p>Phone: {address.phoneNumber}</p>
              </div>
              <div className="address-actions">
                <button 
                  className="edit-btn"
                  onClick={() => handleEdit(address)}
                >
                  Edit
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(address._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No addresses saved yet.</p>
        )}
      </div>
    </div>
  );
};

export default SavedAddresses;
