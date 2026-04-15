// Made by: Aditya Bahekar
// database connection - reused from previous tasks

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/chat-app', {
      directConnection: true,
      family: 4,
    });
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
