const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    district: {
      type: String,
      required: true,
    },
    upazila: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['donor', 'volunteer', 'admin'],
      default: 'donor',
    },
    status: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active',
    },
    donationHistory: [
      {
        amount: { type: Number, required: true },
        currency: { type: String, required: true },
        paymentIntentId: { type: String, required: true },
        status: { type: String, required: true, default: 'succeeded' },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    paymentStatus: {
      type: String,
      enum: ['succeeded', 'pending', 'failed', 'none'],
      default: 'none',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
