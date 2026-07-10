const express = require('express');
const Funding = require('../models/Funding');
const User = require('../models/User');
const { verifyToken, checkNotBlocked } = require('../middleware/auth');
const router = express.Router();

// Initialize Stripe if secret key exists
const stripeKey = process.env.STRIPE_SECRET_KEY;
let stripe = null;
if (stripeKey && !stripeKey.startsWith('sk_test_placeholder')) {
  stripe = require('stripe')(stripeKey);
} else {
  console.warn('STRIPE_SECRET_KEY not set. Operating in mock payment mode.');
}

// @route   POST /api/funding/create-checkout-session
// @desc    Create Stripe Checkout Session
// @access  Private (Active users only)
router.post('/create-checkout-session', verifyToken, checkNotBlocked, async (req, res) => {
  const { amount } = req.body;

  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: 'Invalid donation amount.' });
  }

  try {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    if (stripe) {
      const session = await stripe.checkout.sessions.create({
        automatic_payment_methods: {
          enabled: true,
        },
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'BloodLink Platform Donation',
                description: 'Support blood donation camps and administrative logistics.',
              },
              unit_amount: Math.round(amount * 100), // in cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${clientUrl}/funding?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${clientUrl}/funding?canceled=true`,
        customer_email: req.user.email,
        metadata: {
          donorName: req.user.name,
          donorEmail: req.user.email,
        },
      });

      res.json({ url: session.url, mode: 'live' });
    } else {
      // Mock Redirect fallback for local development
      res.json({
        url: `${clientUrl}/funding?success=true&mock=true&amount=${amount}`,
        mode: 'mock',
      });
    }
  } catch (error) {
    console.error('Stripe Checkout Session error:', error);
    res.status(500).json({ message: 'Failed to initiate checkout session.' });
  }
});

// @route   POST /api/funding/create-payment-intent
// @desc    Create Stripe PaymentIntent
// @access  Private (Active users only)
router.post('/create-payment-intent', verifyToken, checkNotBlocked, async (req, res) => {
  const { amount, currency } = req.body;

  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: 'Invalid donation amount.' });
  }

  const selectedCurrency = currency || 'usd';

  try {
    if (stripe) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // in cents
        currency: selectedCurrency,
        metadata: {
          userId: req.user._id.toString(),
          donorName: req.user.name,
          donorEmail: req.user.email,
        },
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        mode: 'live',
      });
    } else {
      // Mock mode fallback for local development
      res.json({
        clientSecret: `pi_mock_secret_${Math.random().toString(36).substring(2, 10)}`,
        mode: 'mock',
      });
    }
  } catch (error) {
    console.error('Stripe Payment Intent error:', error);
    res.status(500).json({ message: 'Failed to initiate payment intent.' });
  }
});

// @route   POST /api/funding/log-mock
// @desc    Log mock donation details (Fallback helper for local testing when Stripe is not set up)
// @access  Private (Active users only)
router.post('/log-mock', verifyToken, checkNotBlocked, async (req, res) => {
  const { amount, currency } = req.body;
  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: 'Invalid mock amount.' });
  }

  const selectedCurrency = currency || 'usd';

  try {
    const mockIntentId = `pi_mock_${Math.random().toString(36).substring(2, 10)}`;
    const funding = await Funding.create({
      donorName: req.user.name,
      donorEmail: req.user.email,
      amount: Number(amount),
      currency: selectedCurrency,
      paymentIntentId: mockIntentId,
    });

    // Update User schema to track donation history and payment status
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        donationHistory: {
          amount: Number(amount),
          currency: selectedCurrency,
          paymentIntentId: mockIntentId,
          status: 'succeeded',
          createdAt: new Date(),
        }
      },
      $set: {
        paymentStatus: 'succeeded'
      }
    });

    res.status(201).json(funding);
  } catch (error) {
    console.error('Mock donation save error:', error);
    res.status(500).json({ message: 'Failed to record mock donation.' });
  }
});

// @route   POST /api/funding/webhook
// @desc    Stripe webhook endpoint (Must be public, accepts raw body)
// @access  Public
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (!stripe) {
      return res.status(400).send('Stripe is not configured on this server.');
    }
    if (!sig || !endpointSecret) {
      return res.status(400).send('Webhook signature or endpoint secret missing.');
    }

    // Verify webhook signature (req.body must be raw buffer!)
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful payments
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    
    const amount = paymentIntent.amount / 100;
    const currency = paymentIntent.currency;
    const paymentIntentId = paymentIntent.id;
    const userId = paymentIntent.metadata?.userId;
    const donorName = paymentIntent.metadata?.donorName || 'Anonymous Donor';
    const donorEmail = paymentIntent.metadata?.donorEmail || paymentIntent.receipt_email || 'Anonymous Donor';

    try {
      // 1. Create Funding document if not already exists
      const existingFunding = await Funding.findOne({ paymentIntentId });
      if (!existingFunding) {
        await Funding.create({
          donorName,
          donorEmail,
          amount,
          currency,
          paymentIntentId,
        });
        console.log(`Saved ${currency.toUpperCase()} ${amount} donation from ${donorEmail} to MongoDB via Stripe Webhook.`);
      }

      // 2. Update user document
      if (userId) {
        const user = await User.findById(userId);
        if (user) {
          const alreadyLogged = user.donationHistory?.some(item => item.paymentIntentId === paymentIntentId);
          if (!alreadyLogged) {
            await User.findByIdAndUpdate(userId, {
              $push: {
                donationHistory: {
                  amount,
                  currency,
                  paymentIntentId,
                  status: 'succeeded',
                  createdAt: new Date(),
                }
              },
              $set: {
                paymentStatus: 'succeeded'
              }
            });
            console.log(`Successfully updated user ${userId} donation history and paymentStatus.`);
          }
        }
      }
    } catch (dbErr) {
      console.error('Webhook failed to write funding record to DB:', dbErr);
    }
  } else if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    const amount = session.amount_total / 100;
    const paymentIntentId = session.payment_intent || session.id;
    const donorName = session.metadata?.donorName || 'Anonymous Donor';
    const donorEmail = session.metadata?.donorEmail || session.customer_email;

    try {
      const existingFunding = await Funding.findOne({ paymentIntentId });
      if (!existingFunding) {
        await Funding.create({
          donorName,
          donorEmail,
          amount,
          currency: session.currency || 'usd',
          paymentIntentId,
        });
        console.log(`Successfully saved ${session.currency?.toUpperCase()} ${amount} donation from ${donorEmail} to MongoDB via Stripe Webhook.`);
      }
    } catch (dbErr) {
      console.error('Webhook failed to write funding record to DB:', dbErr);
    }
  }

  res.json({ received: true });
});

// @route   GET /api/funding
// @desc    Get all funding history
// @access  Private (Required for funding dashboard table)
router.get('/', verifyToken, async (req, res) => {
  try {
    const fundingHistory = await Funding.find().sort({ createdAt: -1 });
    res.json(fundingHistory);
  } catch (error) {
    console.error('Fetch funding logs error:', error);
    res.status(500).json({ message: 'Error retrieving funding history.' });
  }
});

module.exports = router;
