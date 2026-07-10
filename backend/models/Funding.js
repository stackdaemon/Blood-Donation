const mongoose = require('mongoose');

const fundingSchema = new mongoose.Schema(
  {
    donorName: {
      type: String,
      required: true,
      default: 'Anonymous Donor',
    },
    donorEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: 'usd',
    },
    paymentIntentId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Funding = mongoose.model('Funding', fundingSchema);
module.exports = Funding;
