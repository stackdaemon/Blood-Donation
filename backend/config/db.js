const mongoose = require('mongoose');

const connectDB = async () => {
  const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blood-donation-sm';
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.warn(`MongoDB connection failed: ${error.message}`);
    console.warn('Switching to File-based Mock MongoDB...');
    
    const mockMongoose = require('./mockMongoose');
    require.cache[require.resolve('mongoose')] = {
      id: require.resolve('mongoose'),
      exports: mockMongoose,
      loaded: true
    };
    
    await mockMongoose.connect();
  }
};

module.exports = connectDB;
