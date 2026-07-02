const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('../config/db');

const seedData = async () => {
  try {
    // Connect to database (swaps to mockMongoose if real connection fails)
    await connectDB();

    const User = require('../models/User');
    const DonationRequest = require('../models/DonationRequest');
    const Funding = require('../models/Funding');

    console.log('Clearing existing database collections...');
    await User.deleteMany();
    await DonationRequest.deleteMany();
    await Funding.deleteMany();

    console.log('Inserting seed users...');
    
    // Create users (pre-save hook will hash passwords)
    const admin = new User({
      name: 'Super Admin',
      email: 'admin@blood.com',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      bloodGroup: 'A+',
      district: 'Dhaka',
      upazila: 'Mirpur',
      role: 'admin',
      status: 'active',
    });

    const volunteer = new User({
      name: 'Rashed Volunteer',
      email: 'volunteer@blood.com',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      bloodGroup: 'B+',
      district: 'Chittagong',
      upazila: 'Hathazari',
      role: 'volunteer',
      status: 'active',
    });

    const donorActive = new User({
      name: 'Rahim Donor',
      email: 'donor1@blood.com',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      bloodGroup: 'O+',
      district: 'Dhaka',
      upazila: 'Gulshan',
      role: 'donor',
      status: 'active',
    });

    const donorBlocked = new User({
      name: 'Karim Blocked',
      email: 'donor2@blood.com',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      bloodGroup: 'AB-',
      district: 'Sylhet',
      upazila: 'Beanibazar',
      role: 'donor',
      status: 'blocked',
    });

    await admin.save();
    await volunteer.save();
    await donorActive.save();
    await donorBlocked.save();

    console.log('Users seeded successfully!');

    console.log('Inserting seed donation requests...');
    const requests = [
      {
        requesterName: 'Rahim Donor',
        requesterEmail: 'donor1@blood.com',
        recipientName: 'Abul Kalam',
        recipientDistrict: 'Dhaka',
        recipientUpazila: 'Gulshan',
        hospitalName: 'United Hospital',
        fullAddress: 'Plot 15, Road 71, Gulshan 2',
        bloodGroup: 'O+',
        donationDate: '2026-07-15',
        donationTime: '10:30',
        requestMessage: 'Urgent blood donor needed for bypass surgery.',
        status: 'pending',
      },
      {
        requesterName: 'Rahim Donor',
        requesterEmail: 'donor1@blood.com',
        recipientName: 'Amena Begum',
        recipientDistrict: 'Dhaka',
        recipientUpazila: 'Mirpur',
        hospitalName: 'National Heart Foundation',
        fullAddress: 'Mirpur 2, Dhaka',
        bloodGroup: 'A+',
        donationDate: '2026-07-18',
        donationTime: '14:00',
        requestMessage: 'Looking for A+ blood donor for emergency surgery.',
        status: 'inprogress',
        donorInfo: {
          name: 'Super Admin',
          email: 'admin@blood.com',
        },
      },
      {
        requesterName: 'Rahim Donor',
        requesterEmail: 'donor1@blood.com',
        recipientName: 'Sajid Islam',
        recipientDistrict: 'Chittagong',
        recipientUpazila: 'Hathazari',
        hospitalName: 'Chittagong Medical College',
        fullAddress: 'KB Fazlul Qader Rd, Chattogram',
        bloodGroup: 'B+',
        donationDate: '2026-06-10',
        donationTime: '09:00',
        requestMessage: 'Donor matched, blood successfully transfused. Thank you.',
        status: 'done',
        donorInfo: {
          name: 'Rashed Volunteer',
          email: 'volunteer@blood.com',
        },
      },
      {
        requesterName: 'Sadia Jahan',
        requesterEmail: 'sadia@example.com',
        recipientName: 'Karim Islam',
        recipientDistrict: 'Rajshahi',
        recipientUpazila: 'Paba',
        hospitalName: 'Rajshahi Medical College Hospital',
        fullAddress: 'Laxmipur, Rajshahi',
        bloodGroup: 'AB-',
        donationDate: '2026-07-25',
        donationTime: '11:00',
        requestMessage: 'Patient needs platelet transfusion urgently.',
        status: 'pending',
      },
    ];

    await DonationRequest.insertMany(requests);
    console.log('Donation requests seeded successfully!');

    console.log('Inserting seed funding logs...');
    const fundingLogs = [
      {
        donorName: 'Rahim Donor',
        donorEmail: 'donor1@blood.com',
        amount: 50.0,
        paymentIntentId: 'pi_mock_111111',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
      {
        donorName: 'Super Admin',
        donorEmail: 'admin@blood.com',
        amount: 250.0,
        paymentIntentId: 'pi_mock_222222',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
    ];

    await Funding.insertMany(fundingLogs);
    console.log('Funding logs seeded successfully!');

    console.log('Database seeding complete. Closing database connection...');
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
