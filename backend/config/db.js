const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Try to connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`⚠️  MongoDB Connection Error: ${error.message}`);
    console.log(`\n📝 Note: MongoDB is not running. Please install and start MongoDB, or the app will use in-memory storage (data won't persist).`);
    console.log(`   Install MongoDB: https://www.mongodb.com/try/download/community`);
    console.log(`   Or use MongoDB Atlas (free): https://www.mongodb.com/cloud/atlas`);
    
    // Don't exit - allow app to run without MongoDB for development
    // For production, uncomment the line below
    // process.exit(1);
  }
};

module.exports = connectDB;
