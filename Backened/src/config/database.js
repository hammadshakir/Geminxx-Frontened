// config/database.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const ConnectDB = async () => {
  try {
    // Get MongoDB URI from environment or use default
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rbac_demo';
    
    console.log(`📡 Connecting to MongoDB...`);
    
    // ✅ Mongoose 7+ connection (no deprecated options)
    const conn = await mongoose.connect(mongoURI);
    
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`🔗 Host: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔌 Port: ${conn.connection.port}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔌 MongoDB connection closed through app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error(`💡 Make sure MongoDB is running on your system`);
    process.exit(1);
  }
};

export default ConnectDB;