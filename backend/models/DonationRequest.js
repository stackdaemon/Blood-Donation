const mongoose = require('mongoose');

const donationRequestSchema = new mongoose.Schema(
  {
    requesterName: {
      type: String,
      required: true,
      trim: true,
    },
    requesterEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    recipientName: {
      type: String,
      required: true,
      trim: true,
    },
    recipientDistrict: {
      type: String,
      required: true,
    },
    recipientUpazila: {
      type: String,
      required: true,
    },
    hospitalName: {
      type: String,
      required: true,
      trim: true,
    },
    fullAddress: {
      type: String,
      required: true,
      trim: true,
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    donationDate: {
      type: String, // Stored as YYYY-MM-DD or formatted string
      required: true,
    },
    donationTime: {
      type: String, // Stored as HH:MM or formatted string
      required: true,
    },
    requestMessage: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'inprogress', 'done', 'canceled'],
      default: 'pending',
    },
    donorInfo: {
      name: {
        type: String,
        default: '',
      },
      email: {
        type: String,
        default: '',
      },
    },
  },
  {
    timestamps: true,
  }
);

const DonationRequest = mongoose.model('DonationRequest', donationRequestSchema);
module.exports = DonationRequest;
