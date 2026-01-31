const Address = require('../models/addressModel');

const getUserAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user?._id || req.query.userId });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addAddress = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ 
        message: 'User not authenticated or user ID missing'
      });
    }
    const newAddress = new Address({
      user: req.user._id,
      fullName: req.body.fullName,
      address: req.body.address,
      city: req.body.city,
      pincode: req.body.pincode,
      phoneNumber: req.body.phoneNumber
    });
    const savedAddress = await newAddress.save();
    res.status(201).json(savedAddress);
  } catch (error) {
      res.status(400).json({ message: 'Error adding address' });
  }
};

const updateAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.addressId,
      user: req.user._id
    });

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    const updatedAddress = await Address.findByIdAndUpdate(
      req.params.addressId,
      {
        fullName: req.body.fullName,
        address: req.body.address,
        city: req.body.city,
        pincode: req.body.pincode,
        phoneNumber: req.body.phoneNumber
      },
      { new: true }
    );
    res.json(updatedAddress);
  } catch (error) {
    res.status(400).json({ message: 'Error updating address', error: error.message });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const addressId = req.params.addressId;
    if (!addressId) {
      return res.status(400).json({
        success: false,
        message: 'Address ID is required'
      });
    }

    const deletedAddress = await Address.findOneAndDelete({
      _id: addressId,
      user: req.user._id
    });

    if (!deletedAddress) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
      id: addressId
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Error deleting address',
      error: error.message
    });
  }
};

module.exports = {
  getUserAddresses,
  addAddress,
  updateAddress,
  deleteAddress
};

module.exports = { 
  getUserAddresses, 
  addAddress, 
  updateAddress, 
  deleteAddress 
};