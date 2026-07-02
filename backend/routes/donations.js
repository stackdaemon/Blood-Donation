const express = require('express');
const DonationRequest = require('../models/DonationRequest');
const { verifyToken, checkNotBlocked, authorizeRoles } = require('../middleware/auth');
const router = express.Router();

// @route   POST /api/donations
// @desc    Create a blood donation request
// @access  Private (Active users only)
router.post('/', verifyToken, checkNotBlocked, async (req, res) => {
  const {
    recipientName,
    recipientDistrict,
    recipientUpazila,
    hospitalName,
    fullAddress,
    bloodGroup,
    donationDate,
    donationTime,
    requestMessage,
  } = req.body;

  try {
    if (
      !recipientName ||
      !recipientDistrict ||
      !recipientUpazila ||
      !hospitalName ||
      !fullAddress ||
      !bloodGroup ||
      !donationDate ||
      !donationTime ||
      !requestMessage
    ) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    const newRequest = await DonationRequest.create({
      requesterName: req.user.name,
      requesterEmail: req.user.email,
      recipientName,
      recipientDistrict,
      recipientUpazila,
      hospitalName,
      fullAddress,
      bloodGroup,
      donationDate,
      donationTime,
      requestMessage,
      status: 'pending',
    });

    res.status(201).json(newRequest);
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ message: 'Failed to create donation request.' });
  }
});

// @route   GET /api/donations/recent
// @desc    Get 3 recent requests of logged-in donor
// @access  Private
router.get('/recent', verifyToken, async (req, res) => {
  try {
    const requests = await DonationRequest.find({ requesterEmail: req.user.email })
      .sort({ createdAt: -1 })
      .limit(3);
    res.json(requests);
  } catch (error) {
    console.error('Fetch recent requests error:', error);
    res.status(500).json({ message: 'Error retrieving recent requests.' });
  }
});

// @route   GET /api/donations
// @desc    Get all donation requests with filtering & pagination
// @access  Public / Private
router.get('/', async (req, res) => {
  const { status, requesterEmail, page = 1, limit = 10 } = req.query;

  try {
    const query = {};

    if (status) query.status = status;
    if (requesterEmail) query.requesterEmail = requesterEmail;

    const count = await DonationRequest.countDocuments(query);
    const requests = await DonationRequest.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.json({
      requests,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalRequests: count,
    });
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ message: 'Error fetching donation requests.' });
  }
});

// @route   GET /api/donations/:id
// @desc    Get single donation request details
// @access  Private (Required for details page access)
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const request = await DonationRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Donation request not found.' });
    }
    res.json(request);
  } catch (error) {
    console.error('Get request by ID error:', error);
    res.status(500).json({ message: 'Error retrieving donation request details.' });
  }
});

// @route   PUT /api/donations/:id
// @desc    Update donation request details
// @access  Private (Admin, or Owner Donor)
router.put('/:id', verifyToken, checkNotBlocked, async (req, res) => {
  const {
    recipientName,
    recipientDistrict,
    recipientUpazila,
    hospitalName,
    fullAddress,
    bloodGroup,
    donationDate,
    donationTime,
    requestMessage,
  } = req.body;

  try {
    const request = await DonationRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Donation request not found.' });
    }

    // Role verification: Only Admin, or Owner of request
    if (req.user.role !== 'admin' && request.requesterEmail !== req.user.email) {
      return res.status(403).json({ message: 'Access denied. You do not own this request.' });
    }

    if (recipientName) request.recipientName = recipientName;
    if (recipientDistrict) request.recipientDistrict = recipientDistrict;
    if (recipientUpazila) request.recipientUpazila = recipientUpazila;
    if (hospitalName) request.hospitalName = hospitalName;
    if (fullAddress) request.fullAddress = fullAddress;
    if (bloodGroup) request.bloodGroup = bloodGroup;
    if (donationDate) request.donationDate = donationDate;
    if (donationTime) request.donationTime = donationTime;
    if (requestMessage) request.requestMessage = requestMessage;

    await request.save();
    res.json(request);
  } catch (error) {
    console.error('Update donation error:', error);
    res.status(500).json({ message: 'Failed to update donation request.' });
  }
});

// @route   DELETE /api/donations/:id
// @desc    Delete donation request
// @access  Private (Admin, or Owner Donor)
router.delete('/:id', verifyToken, checkNotBlocked, async (req, res) => {
  try {
    const request = await DonationRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Donation request not found.' });
    }

    // Role verification: Only Admin, or Owner of request
    if (req.user.role !== 'admin' && request.requesterEmail !== req.user.email) {
      return res.status(403).json({ message: 'Access denied. You do not own this request.' });
    }

    await DonationRequest.deleteOne({ _id: req.params.id });
    res.json({ message: 'Donation request has been successfully deleted.' });
  } catch (error) {
    console.error('Delete request error:', error);
    res.status(500).json({ message: 'Failed to delete donation request.' });
  }
});

// @route   PATCH /api/donations/:id/status
// @desc    Update request status
// @access  Private (Admin, Volunteer, or Owner Donor)
router.patch('/:id/status', verifyToken, checkNotBlocked, async (req, res) => {
  const { status } = req.body; // 'pending', 'inprogress', 'done', 'canceled'

  try {
    if (!['pending', 'inprogress', 'done', 'canceled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status transition.' });
    }

    const request = await DonationRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Donation request not found.' });
    }

    const isOwner = request.requesterEmail === req.user.email;
    const isStaff = req.user.role === 'admin' || req.user.role === 'volunteer';

    if (!isOwner && !isStaff) {
      return res.status(403).json({ message: 'Unauthorized. You cannot modify status for this request.' });
    }

    request.status = status;
    await request.save();

    res.json(request);
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Failed to update request status.' });
  }
});

// @route   PATCH /api/donations/:id/donate
// @desc    Respond to donation request (status -> inprogress, add donorInfo)
// @access  Private (Active users only)
router.patch('/:id/donate', verifyToken, checkNotBlocked, async (req, res) => {
  try {
    const request = await DonationRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Donation request not found.' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'This donation request is no longer pending.' });
    }

    if (request.requesterEmail === req.user.email) {
      return res.status(400).json({ message: 'You cannot donate to your own request.' });
    }

    request.status = 'inprogress';
    request.donorInfo = {
      name: req.user.name,
      email: req.user.email,
    };

    await request.save();
    res.json(request);
  } catch (error) {
    console.error('Respond to donation error:', error);
    res.status(500).json({ message: 'Failed to record donation response.' });
  }
});

module.exports = router;
