const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  getUserAddresses, 
  addAddress, 
  updateAddress, 
  deleteAddress 
} = require('../controllers/addressController');
  
router.use(protect);

router.get('/', getUserAddresses);
router.post('/', addAddress);
router.put('/:addressId', updateAddress);
router.delete('/:addressId', (req, res, next) => {
  next();
}, deleteAddress);
module.exports = router;