const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MongoDB connection error: process.env.MONGO_URI is undefined. Create a .env file with MONGO_URI.');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB at:', uri);
    await mongoose.connect(uri, {
      // useNewUrlParser, useUnifiedTopology are defaults now; you may add options if needed
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

