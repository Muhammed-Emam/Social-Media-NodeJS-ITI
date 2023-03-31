
const express = require('express');
const {
  register,
  login,
  logout,
  getMe
} = require('../controllers/auth');

const router = express.Router();

const { protect, authorize } = require('../middlewares/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);

module.exports = router