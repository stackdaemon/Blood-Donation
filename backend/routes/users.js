const express = require('express');
const User = require('../models/User');
const DonationRequest = require('../models/DonationRequest');
const Funding = require('../models/Funding');
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/users/search
// @desc    Search active donors
// @access  Public
router.get('/search', async (req, res) => {
  const { bloodGroup, district, upazila } = req.query;

  try {
    const query = { role: 'donor', status: 'active' };

    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (district) query.district = district;
    if (upazila) query.upazila = upazila;

    const donors = await User.find(query).select('name email avatar bloodGroup district upazila status');
    res.json(donors);
  } catch (error) {
    console.error('Search donors error:', error);
    res.status(500).json({ message: 'Error retrieving donors list.' });
  }
});

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', verifyToken, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching profile.' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile (except email)
// @access  Private
router.put('/profile', verifyToken, async (req, res) => {
  const { name, avatar, bloodGroup, district, upazila } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (name) user.name = name;
    if (avatar) user.avatar = avatar;
    if (bloodGroup) user.bloodGroup = bloodGroup;
    if (district) user.district = district;
    if (upazila) user.upazila = upazila;

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bloodGroup: user.bloodGroup,
      district: user.district,
      upazila: user.upazila,
      role: user.role,
      status: user.status,
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Error updating user profile.' });
  }
});

// @route   GET /api/users/stats
// @desc    Get dashboard metrics (total users, total donation requests, total funding)
// @access  Private (Admin and Volunteer only)
router.get('/stats', verifyToken, authorizeRoles('admin', 'volunteer'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDonationRequests = await DonationRequest.countDocuments();
    
    // Aggregation to sum funding amount
    const fundingStats = await Funding.aggregate([
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
    ]);

    const totalFunding = fundingStats.length > 0 ? fundingStats[0].totalAmount : 0;

    res.json({
      totalUsers,
      totalDonationRequests,
      totalFunding,
    });
  } catch (error) {
    console.error('Stats loading error:', error);
    res.status(500).json({ message: 'Error retrieving platform statistics.' });
  }
});

// @route   GET /api/users
// @desc    Get all users list (paginated/filtered)
// @access  Private (Admin only)
router.get('/', verifyToken, authorizeRoles('admin'), async (req, res) => {
  const { status } = req.query;

  try {
    const query = {};
    if (status) query.status = status;

    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Error retrieving user list.' });
  }
});

// @route   PATCH /api/users/:id/status
// @desc    Block or unblock user
// @access  Private (Admin only)
router.patch('/:id/status', verifyToken, authorizeRoles('admin'), async (req, res) => {
  const { status } = req.body; // 'active' or 'blocked'

  try {
    if (!['active', 'blocked'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status type.' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Do not block oneself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot block your own admin account.' });
    }

    user.status = status;
    await user.save();

    res.json({ message: `User account has been successfully ${status}.`, user });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Error modifying user account status.' });
  }
});

// @route   PATCH /api/users/:id/role
// @desc    Change user role (donor, volunteer, admin)
// @access  Private (Admin only)
router.patch('/:id/role', verifyToken, authorizeRoles('admin'), async (req, res) => {
  const { role } = req.body; // 'donor', 'volunteer', 'admin'

  try {
    if (!['donor', 'volunteer', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role assignment.' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Do not modify own role
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot modify your own role.' });
    }

    user.role = role;
    await user.save();

    res.json({ message: `User role has been updated to ${role}.`, user });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ message: 'Error modifying user role.' });
  }
});

module.exports = router;
